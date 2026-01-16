const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

/* ================= ROUTES ================= */
const chatRoutes = require("./routes/chat");

const app = express();

/* ================= DATABASE ================= */
connectDB();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true
  })
);

app.use(express.json());

/* ================= ROUTES ================= */

// 🧠 AI Chat routes (NO authentication)
app.use("/api/chat", chatRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("API is running");
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
