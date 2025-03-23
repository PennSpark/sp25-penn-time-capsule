const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const router = express.Router();
const tokenExpiration = "1d";

// Register User - TESTED AND WORKING
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: tokenExpiration,
    });
    res.json({ token, userId: user._id, username, email });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Login User - TESTED AND WORKING
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: tokenExpiration,
    });
    res.json({ token, userId: user._id, email });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.post('/auth/google/register', async (req, res) => {
  const { access_token } = req.body;
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: access_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // If user exists, return error or instruct client to login instead
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create a new user. Using googleId to generate a hashed password.
    const randomPassword = await bcrypt.hash(googleId, 10);
    user = new User({ username: name, email, password: randomPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: tokenExpiration,
    });
    res.json({ token, userId: user._id, username: user.username, email });
  } catch (err) {
    console.error("Google signup error:", err);
    res.status(500).json({ message: "Google signup failed" });
  }
})

router.post('/auth/google/login', async (req, res) => {
  const { access_token } = req.body;
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: access_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email } = payload;

    // Check if user exists. If not, instruct them to sign up.
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist. Please sign up." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: tokenExpiration,
    });
    res.json({ token, userId: user._id, username: user.username, email });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
})

module.exports = router;
