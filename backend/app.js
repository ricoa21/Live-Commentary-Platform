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
    console.log("Fetching Scottish Premiership fixtures...");

    // Step 1: Get the current season ID for the Scottish Premiership
    const leagueResponse = await axios.get(
      `${SPORTMONKS_BASE_URL}/leagues/501`,
      {
        params: {
          api_token: SPORTMONKS_API_KEY,
          include: "currentSeason",
        },
      }
    );

    if (
      !leagueResponse.data.data ||
      !leagueResponse.data.data.current_season_id
    ) {
      throw new Error(
        "Unable to retrieve current season ID for Scottish Premiership."
      );
    }

    const currentSeasonId = leagueResponse.data.data.current_season_id;
    console.log(
      `Current Season ID for Scottish Premiership: ${currentSeasonId}`
    );

    // Step 2: Fetch fixtures for the current season
    const fixturesResponse = await axios.get(
      `${SPORTMONKS_BASE_URL}/fixtures`,
      {
        params: {
          api_token: SPORTMONKS_API_KEY,
          league_id: 501, // Scottish Premiership League ID
          season_id: currentSeasonId,
          include: "participants",
          filters: "status:NS", // Only fetch Not Started matches
          sort: "starting_at", // Sort by start time
          timezone: "Europe/London", // Use correct timezone
        },
      }
    );

    if (
      !fixturesResponse.data.data ||
      !Array.isArray(fixturesResponse.data.data)
    ) {
      throw new Error("Invalid fixtures data structure received.");
    }

    const validFixtures = fixturesResponse.data.data.filter(
      (fixture) =>
        fixture.participants?.length >= 2 &&
        new Date(fixture.starting_at) > new Date()
    );

    console.log(
      `Valid Scottish Premiership fixtures count: ${validFixtures.length}`
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
    console.error("Error fetching Scottish Premiership fixtures:", {
      message: error.message,
      responseData: error.response?.data,
    });

    res.status(500).json({
      error: "Failed to fetch Scottish Premiership fixtures.",
      details:
        process.env.NODE_ENV === "development"
          ? { message: error.message, responseData: error.response?.data }
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

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);

  res.status(500).json({
    error: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
});

module.exports = app;
