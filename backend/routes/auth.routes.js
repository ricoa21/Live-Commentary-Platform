const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Updated this line
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Log received data (remove in production)
    console.log("Received registration data:", {
      username,
      password: "******",
    });

    // Validate input
    if (!username || !password) {
      console.log("Validation error: Missing username or password");
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check for existing user
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
