const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const sequelize = require("./config/database");
const axios = require("axios");
require("dotenv").config();

const User = require("./models/User");
const Comment = require("./models/Comment");
const auth = require("./middleware/auth"); // Your existing auth middleware

// Associations
Comment.belongsTo(User);
User.hasMany(Comment);

const app = express();

// Enable CORS with specific options
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const SPORTMONKS_BASE_URL =
  "https://api.sportmonks.com/v3/football/fixtures/upcoming/markets";
const SPORTMONKS_API_KEY = process.env.REACT_APP_SPORTSMONK_API_KEY;

// Protected Danish fixtures endpoint
app.get("/api/fixtures/danish", auth, async (req, res) => {
  // Added auth middleware here
  try {
    console.log("Fetching Danish Superliga fixtures...");
    console.log("Authenticated User ID:", req.user.id); // Now accessible via auth middleware

    const marketID = 271;
    const { date, team } = req.query;

    const fixturesResponse = await axios.get(
      `${SPORTMONKS_BASE_URL}/${marketID}`,
      {
        params: {
          api_token: SPORTMONKS_API_KEY,
          include: "participants",
          order: "starting_at",
          per_page: 50,
          timezone: "Europe/Copenhagen",
          ...(date && { starting_from: date }),
          ...(team && { participants: team }),
        },
      }
    );

    const validFixtures = fixturesResponse.data.data.filter(
      (fixture) => fixture.participants?.length >= 2
    );

    res.json({
      data: validFixtures.map((fixture) => ({
        id: fixture.id,
        starting_at: fixture.starting_at,
        participants: fixture.participants.map((p) => ({
          id: p.id,
          name: p.name,
          logo: p.image_path,
        })),
        status: fixture.status,
      })),
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
});

// Rest of your app.js remains unchanged...
