const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    sessionId: { type: String, required: true },
    userMessage: { type: String, required: true },
    botReply: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);