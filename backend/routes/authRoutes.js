const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

// Simple in-memory blacklist for logged out JWTs
const blacklistedTokens = new Set();

/* =====================
   REGISTER
===================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({ message: "User Registered", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   LOGIN
===================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   LOGOUT
===================== */
router.post("/logout", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Token from header
    if (token) {
      blacklistedTokens.add(token); // Add token to blacklist
    }
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   GOOGLE AUTH
===================== */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

/* =====================
   JWT BLACKLIST CHECK MIDDLEWARE
===================== */
function checkBlacklist(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token && blacklistedTokens.has(token)) {
    return res.status(401).json({ message: "Token is invalidated" });
  }
  next();
}

// Example protected route using blacklist middleware
router.get("/protected", passport.authenticate("jwt", { session: false }), checkBlacklist, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

module.exports = router;
