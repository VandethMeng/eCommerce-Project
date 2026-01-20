import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function testKey() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello, test my API key" }]
    });
    console.log("API Key Works! AI replied:");
    console.log(completion.choices[0].message.content);
  } catch (err) {
    console.error("API Key Error:", err.message);
  }
}

testKey();
