// app.js

require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const sequelize = require("./config/database");
const axios = require("axios");

// Import models and middleware
const User = require("./models/User");
const Comment = require("./models/Comment");
const auth = require("./middleware/auth");

// Set up associations
Comment.belongsTo(User);
User.hasMany(Comment);

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());

// Import and use authentication routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// SportMonks API setup
const SPORTMONKS_BASE_URL =
  "https://api.sportmonks.com/v3/football/fixtures/upcoming/markets";
const SPORTMONKS_API_KEY = process.env.REACT_APP_SPORTSMONK_API_KEY;

// Protected endpoint for Danish Superliga fixtures
app.get("/api/fixtures/danish", auth, async (req, res) => {
  try {
    const marketID = 271; // Danish Superliga Market ID
    const { date, team } = req.query; // Optional filters

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

    // Filter out fixtures with less than 2 participants
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
    console.error("Error fetching fixtures:", error.message);
    res.status(500).json({
      error: "Failed to fetch fixtures",
      details: error.response?.data?.message || "Check server logs",
    });
  }
});

// Set up HTTP server and Socket.IO for real-time updates
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("request_fixture_updates", (fixtureId) => {
    console.log(`Client requested updates for fixture ID ${fixtureId}`);

    // Set up interval for sending updates every 30 seconds
    const interval = setInterval(async () => {
      try {
        const updatedFixtureResponse = await axios.get(
          `${SPORTMONKS_BASE_URL}/latest`,
          {
            params: {
              api_token: SPORTMONKS_API_KEY,
              include: "participants",
              id: fixtureId,
            },
          }
        );

        const updatedFixture = updatedFixtureResponse.data.data;
        socket.emit("fixture_update", updatedFixture);
      } catch (error) {
        console.error(
          `Error fetching updates for fixture ID ${fixtureId}:`,
          error.message
        );
      }
    }, 30000); // 30 seconds

    // Clean up interval when user disconnects
    socket.on("disconnect", () => {
      clearInterval(interval);
      console.log(`User disconnected: ${socket.id}`);
    });
  });
});

// Start server after syncing database
const PORT = process.env.PORT || 4000;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & tables created!");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("Error syncing database:", err));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
});

module.exports = app;
