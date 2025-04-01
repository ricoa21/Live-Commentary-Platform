const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const sequelize = require("./config/database");
const axios = require("axios");
require("dotenv").config();

const User = require("./models/User");
const Comment = require("./models/Comment");

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

const SPORTMONKS_BASE_URL = "https://api.sportmonks.com/v3/football";
const SPORTMONKS_API_KEY = process.env.REACT_APP_SPORTSMONK_API_KEY;

app.get("/api/fixtures/danish", async (req, res) => {
  try {
    console.log("Fetching Danish Superliga fixtures...");

    const response = await axios.get(`${SPORTMONKS_BASE_URL}/fixtures`, {
      params: {
        api_token: SPORTMONKS_API_KEY,
        league_id: 271, // Danish Superliga ID
        include: "participants",
        filters: "status:NS",
        sort: "starting_at",
        timezone: "Europe/Copenhagen",
        per_page: 50,
      },
    });

    console.log(
      "Fixtures API Response:",
      JSON.stringify(response.data, null, 2)
    );

    const validFixtures = response.data.data.filter(
      (fixture) =>
        fixture.participants?.length >= 2 &&
        new Date(fixture.starting_at) > new Date()
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
    console.error("Full error details:", {
      message: error.message,
      responseData: error.response?.data,
      stack: error.stack,
    });

    res.status(500).json({
      error: "Failed to fetch Danish fixtures",
      details:
        process.env.NODE_ENV === "development"
          ? {
              message: error.message,
              sportmonksError: error.response?.data,
            }
          : null,
    });
  }
});

// Rest of your existing backend code remains the same...
// (Socket.io setup, server initialization, etc.)
