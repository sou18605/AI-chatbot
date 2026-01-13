const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sessionId: { type: String, required: true }, // New: track session
  userMessage: { type: String, required: true },
  botReply: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
