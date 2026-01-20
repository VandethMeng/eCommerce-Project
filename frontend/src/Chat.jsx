import { useState } from "react";

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // show user message
    setChat(prev => [...prev, { role: "user", text: message }]);
    setMessage("");

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    setChat(prev => [...prev, { role: "ai", text: data.reply }]);
  };

  return (
    <div style={{ width: "400px", margin: "auto" }}>
      <h2>AI Chat</h2>

      <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: "300px" }}>
        {chat.map((c, i) => (
          <p key={i}>
            <b>{c.role === "user" ? "You" : "AI"}:</b> {c.text}
          </p>
        ))}
      </div>

      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Ask something..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
