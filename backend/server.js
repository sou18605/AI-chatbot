const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const chatRoutes = require("./routes/chat");

/* 🔹 ADDED (Auth imports) */
const passport = require("passport");
require("./config/passport");          // Google strategy
const authRoutes = require("./routes/authRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

/* 🔹 ADDED (Passport init) */
app.use(passport.initialize());

/* EXISTING ROUTE (UNCHANGED) */
app.use("/api/chat", chatRoutes);

/* 🔹 ADDED (Auth routes) */
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
