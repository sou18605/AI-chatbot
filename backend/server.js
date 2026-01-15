const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

/* ================= ROUTES ================= */
const chatRoutes = require("./routes/chat");
const authRoutes = require("./routes/authRoutes");

/* ================= AUTH ================= */
const passport = require("passport");
require("./config/passport");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

/* ================= DATABASE ================= */
connectDB();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));
app.use(express.json());

/* ================= PASSPORT ================= */
app.use(passport.initialize());

/* ================= ROUTES ================= */

// 🔐 Protected AI chat routes (JWT required)
app.use("/api/chat", authMiddleware, chatRoutes);

// 🔓 Auth routes (login, register, google)
app.use("/api/auth", authRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("API is running");
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
