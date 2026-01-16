require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const chatRoutes = require("./routes/chat");

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Connect MongoDB =====
connectDB();

// ===== Routes =====
app.use("/api/chat", chatRoutes);

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
