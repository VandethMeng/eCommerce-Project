import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import products from "./products.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "8kb" }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// GET route to test server in browser
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.get("/api/products", (req, res) => {
  res.json({ products });
});

// POST route for AI chat
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  const normalizedMessage = typeof message === "string" ? message.trim() : "";
  if (!normalizedMessage) {
    return res.status(400).json({ reply: "Message is required" });
  }
  if (normalizedMessage.length > 1000) {
    return res.status(400).json({ reply: "Message is too long" });
  }
  try {
    const productContext = products
      .map(
        (product) =>
          `${product.name} | $${product.price} | ${product.category} | ${product.description}`
      )
      .join("\n");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful ecommerce assistant. Answer using only the product catalog. If a product is not listed, say you do not have that item.",
        },
        {
          role: "system",
          content: `Product catalog:\n${productContext}`,
        },
        { role: "user", content: normalizedMessage },
      ],
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AI error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
