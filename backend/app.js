const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose"); // Add Mongoose for MongoDB
const sequelize = require("./config/database");
const axios = require("axios");
require("dotenv").config();

const User = require("./models/User");
const Comment = require("./models/Comment");
const auth = require("./middleware/auth"); // Authentication middleware

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

// MongoDB Connection (Updated for live-commentary-platform)
const mongoDB =
  "mongodb://Ricoa21:Stockholm%2528@127.0.0.1:27017/live-commentary-platform?authSource=admin";
mongoose
  .connect(mongoDB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const SPORTMONKS_BASE_URL =
  "https://api.sportmonks.com/v3/football/fixtures/upcoming/markets";
const SPORTMONKS_API_KEY = process.env.REACT_APP_SPORTSMONK_API_KEY;

// Protected Danish fixtures endpoint
app.get("/api/fixtures/danish", auth, async (req, res) => {
  try {
    console.log("Fetching Danish Superliga fixtures...");
    console.log("Authenticated User ID:", req.user.id); // Access authenticated user ID

    const marketID = 271; // Danish Superliga Market ID
    const { date, team } = req.query; // Filters for date and team

    const fixturesResponse = await axios.get(
      `${SPORTMONKS_BASE_URL}/${marketID}`,
      {
        params: {
          api_token: SPORTMONKS_API_KEY,
          include: "participants",
          order: "starting_at",
          per_page: 50,
          timezone: "Europe/Copenhagen",
          ...(date && { starting_from: date }), // Add date filter if provided
          ...(team && { participants: team }), // Add team filter if provided
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

// Socket.IO setup for real-time updates
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

    setInterval(async () => {
      try {
        const updatedFixtureResponse = await axios.get(
          `${SPORTMONKS_BASE_URL}/latest`,
          {
            params: {
              api_token: SPORTMONKS_API_KEY,
              include: "participants",
              id: fixtureId, // Get updates for a specific fixture ID
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
    }, 30000); // Fetch updates every 30 seconds
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & tables created!");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("Error syncing database:", err));

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);

  res.status(500).json({
    error: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
});

module.exports = app;
