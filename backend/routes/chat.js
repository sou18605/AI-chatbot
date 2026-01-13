// routes/chat.js (complete fixed code)
const express = require("express");
const axios = require("axios");
const Chat = require("../models/Chat");

const router = express.Router();

// POST /api/chat -> send message
router.post("/", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });
    if (!sessionId) return res.status(400).json({ error: "Session ID is required" });

    // Fetch previous messages for context
    const history = await Chat.find({ sessionId }).sort({ createdAt: 1 });

    // Prepare messages for Nebius API
    const messages = [
      {
        role: "system",
        content: `You are a helpful AI assistant. Always format answers clearly:
- Use headings
- Use bullet points
- Use short paragraphs
- Use code blocks when needed
- Never respond as one long paragraph`
      },
      ...history.flatMap(chat => [
        { role: "user", content: chat.userMessage },
        { role: "assistant", content: chat.botReply }
      ]),
      { role: "user", content: message } // current user message
    ];

    // Call Nebius API (fixed template literal)
    const response = await axios.post(
      "https://api.tokenfactory.nebius.com/v1/chat/completions",
      {
        model: "moonshotai/Kimi-K2-Instruct",
        messages,
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEBIUS_API_KEY}`, // Fixed backticks
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    // Save chat
    await Chat.create({ sessionId, userMessage: message, botReply: reply });

    res.json({ reply });
  } catch (error) {
    console.error("Nebius Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI generation failed" });
  }
});

// GET /api/chat/history/:sessionId -> get chat history
router.get("/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await Chat.find({ sessionId }).sort({ createdAt: 1 });
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// GET /api/chat/sessions -> list all sessions with readable titles
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await Chat.aggregate([
      {
        $group: {
          _id: "$sessionId",
          firstMessage: { $first: "$userMessage" },
          lastUpdated: { $max: "$createdAt" },
          lastMessage: { $last: "$userMessage" }
        }
      },
      {
        $addFields: { // Add readable title
          title: {
            $cond: {
              if: { $gt: [{ $strLenCP: "$firstMessage" }, 60] },
              then: { $concat: [{ $substrCP: ["$firstMessage", 0, 60] }, "..." ] },
              else: "$firstMessage"
            }
          }
        }
      },
      {
        $sort: { lastUpdated: -1 }
      },
      {
        $project: {
          sessionId: "$_id",
          title: 1,
          lastUpdated: 1,
          lastMessage: 1,
          _id: 0
        }
      }
    ]);
    res.json({ sessions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

module.exports = router;
