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
    // First, get the current season ID
    const leagueResponse = await axios.get(
      `${SPORTMONKS_BASE_URL}/leagues/501`,
      {
        params: {
          api_token: SPORTMONKS_API_KEY,
          include: "currentSeason",
        },
      }
    );
    const currentSeasonId = leagueResponse.data.data.current_season_id;

    // Then, fetch the fixtures using the current season ID
    const fixturesResponse = await axios.get(
      `${SPORTMONKS_BASE_URL}/fixtures`,
      {
        params: {
          api_token: SPORTMONKS_API_KEY,
          league_id: 501,
          season_id: currentSeasonId,
          include: "participants",
        },
      }
    );

    res.json(fixturesResponse.data);
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    res.status(500).json({ error: "Failed to fetch fixtures" });
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
