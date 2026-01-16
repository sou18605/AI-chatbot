const express = require("express");
const axios = require("axios");
const Chat = require("../models/Chat");

const router = express.Router();

// ===== TEMP: Mock user (replace with JWT auth later) =====
router.use((req, res, next) => {
  req.user = { id: "test-user-123" }; // mock user
  next();
});

// ===== SEND MESSAGE =====
router.post("/send", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user.id;

    if (!message || !sessionId) {
      return res.status(400).json({ error: "Message & sessionId required" });
    }

    // ===== Fetch last 10 messages from this session =====
    const history = await Chat.find({ userId, sessionId })
      .sort({ createdAt: 1 })
      .limit(10);

    const messages = [
      {
        role: "system",
        content:
          "You are a helpful AI assistant. Use headings, bullet points, and short paragraphs."
      },
      ...history.flatMap(chat => [
        { role: "user", content: chat.userMessage },
        { role: "assistant", content: chat.botReply }
      ]),
      { role: "user", content: message }
    ];

    // ===== Call Nebius AI API =====
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
          Authorization: `Bearer ${process.env.NEBIUS_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    // ===== Save chat to DB =====
    await Chat.create({
      userId,
      sessionId,
      userMessage: message,
      botReply: reply
    });

    res.json({ reply });
  } catch (err) {
    console.error("Nebius API error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI generation failed" });
  }
});

// ===== CHAT HISTORY =====
router.get("/history/:sessionId", async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    const history = await Chat.find({ userId, sessionId }).sort({ createdAt: 1 });

    res.json({ history });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// ===== USER SESSIONS =====
router.get("/sessions", async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await Chat.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$sessionId",
          firstMessage: { $first: "$userMessage" },
          lastUpdated: { $max: "$createdAt" }
        }
      },
      {
        $sort: { lastUpdated: -1 }
      },
      {
        $project: {
          sessionId: "$_id",
          title: "$firstMessage",
          lastUpdated: 1,
          _id: 0
        }
      }
    ]);

    res.json({ sessions });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

module.exports = router;
