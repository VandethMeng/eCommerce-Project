import { useRef, useState } from "react";
import "./ChatWidget.css";

function ChatWidget({ variant = "widget" }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(variant === "page");
  const activeRequestRef = useRef(null);
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(
    /\/$/,
    "",
  );

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }

    const controller = new AbortController();
    activeRequestRef.current = controller;
    setIsLoading(true);
    setError("");

    setChat((prev) => [...prev, { role: "user", text: message }]);
    const outgoingMessage = message;
    setMessage("");

    try {
      const res = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: outgoingMessage }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();

      setChat((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
      }
      setIsLoading(false);
    }
  };

  const panel = (
    <div className="chat-panel">
      <div className="chat-header">
        <div>
          <h3>Need help?</h3>
          <p>Ask about prices, materials, or availability.</p>
        </div>
        {variant === "widget" ? (
          <button className="chat-close" onClick={() => setIsOpen(false)}>
            Close
          </button>
        ) : null}
      </div>

      <div className="chat-messages">
        {chat.length === 0 ? (
          <div className="chat-empty">
            Hi! I can answer questions about today&apos;s catalog.
          </div>
        ) : null}
        {chat.map((c, i) => (
          <div
            key={i}
            className={`chat-bubble ${c.role === "user" ? "user" : "ai"}`}
          >
            <span>{c.text}</span>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about a product..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
      {error ? <p className="chat-error">{error}</p> : null}
    </div>
  );

  if (variant === "page") {
    return <div className="chat-page">{panel}</div>;
  }

  return (
    <div className="chat-widget">
      {isOpen ? panel : null}
      <button className="chat-fab" onClick={() => setIsOpen(true)}>
        Chat with us
      </button>
    </div>
  );
}

export default ChatWidget;
