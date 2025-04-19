// backend/routes/auth.routes.js

const express = require("express");
const router = express.Router(); // <-- THIS LINE WAS MISSING
const bcrypt = require("bcryptjs");
const { User } = require("../models/User")(sequelize); // Pass your sequelize instance

// Register route
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ id: user.id, username: user.username });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  // Add your login logic here
});

module.exports = router; // <-- THIS EXPORT WAS MISSING
