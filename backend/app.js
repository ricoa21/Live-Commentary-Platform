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

app.get("/api/fixtures/scotland", async (req, res) => {
  try {
    console.log("Starting Scottish fixtures fetch...");

    // 1. Get league data with current season
    const leagueResponse = await axios.get(
      `${SPORTMONKS_BASE_URL}/leagues/501`,
      {
        params: {
          api_token: SPORTMONKS_API_KEY,
          include: "currentSeason",
        },
      }
    );

    console.log(
      "League API Response:",
      JSON.stringify(leagueResponse.data, null, 2)
    );

    if (!leagueResponse.data.data) {
      throw new Error("Invalid league data response");
    }

    const currentSeasonId = leagueResponse.data.data.current_season_id;
    console.log("Current Season ID:", currentSeasonId);

    // 2. Get fixtures for current season
    const fixturesResponse = await axios.get(
      `${SPORTMONKS_BASE_URL}/fixtures`,
      {
        params: {
          api_token: SPORTMONKS_API_KEY,
          league_id: 501,
          season_id: currentSeasonId,
          include: "participants",
          filters: "status:NS", // Only not-started matches
          sort: "starting_at", // Sort by date
          per_page: 20, // Limit results
          timezone: "Europe/London", // Set correct timezone
        },
      }
    );

    console.log(
      "Fixtures API Response:",
      JSON.stringify(fixturesResponse.data, null, 2)
    );

    // 3. Validate response structure
    if (
      !fixturesResponse.data.data ||
      !Array.isArray(fixturesResponse.data.data)
    ) {
      throw new Error("Invalid fixtures data structure");
    }

    // 4. Filter and format fixtures
    const validFixtures = fixturesResponse.data.data.filter(
      (fixture) =>
        fixture.participants?.length >= 2 &&
        new Date(fixture.starting_at) > new Date()
    );

    console.log("Valid fixtures count:", validFixtures.length);

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
    console.error("Error fetching fixtures:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    res.status(500).json({
      error: "Failed to fetch fixtures",
      details:
        process.env.NODE_ENV === "development"
          ? {
              message: error.message,
              apiResponse: error.response?.data,
            }
          : null,
    });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io setup remains unchanged
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("new_comment", async (commentData) => {
    try {
      const { content, userId } = commentData;

      const user = await User.findByPk(userId);
      if (!user) {
        console.error(`User with ID ${userId} not found`);
        return;
      }

      const comment = await Comment.create({ content, UserId: userId });
      const commentWithUser = await Comment.findByPk(comment.id, {
        include: [{ model: User, attributes: ["username"] }],
      });

      io.emit("comment_received", commentWithUser);
    } catch (error) {
      console.error("Error saving comment:", error);
    }
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

// Enhanced error handling
app.use((err, req, res, next) => {
  console.error("Global error handler:", {
    message: err.message,
    stack: err.stack,
    originalUrl: req.originalUrl,
  });

  res.status(500).json({
    error: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      details: err.message,
      stack: err.stack,
    }),
  });
});

module.exports = app;
