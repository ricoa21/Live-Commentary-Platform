const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Registration route
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Received registration data:", {
      username,
      password: "******",
    });

    if (!username || !password) {
      console.log("Validation error: Missing username or password");
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.log(`User already exists: ${username}`);
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    console.log(`User registered successfully: ${username}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// New protected route for posting comments
router.post("/comments", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    // Here you would typically save the comment to your database
    // For now, we'll just send a success response
    res.status(201).json({ message: "Comment posted successfully" });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ message: "Error posting comment" });
  }
});

module.exports = router;
