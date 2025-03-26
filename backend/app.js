const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const sequelize = require("./config/database");
const axios = require("axios");
const dotenv = require("dotenv");

const User = require("./models/User");
const Comment = require("./models/Comment");
const authRoutes = require("./routes/auth.routes");
const auth = require("./middleware/auth");

dotenv.config();

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

// Routes
app.use("/api/auth", authRoutes);

const SPORTMONKS_BASE_URL = "https://api.sportmonks.com/v3/football";
const SPORTMONKS_API_KEY = process.env.SPORTMONKS_API_KEY;

// Middleware to handle API requests
const handleApiRequest = async (url, params, res) => {
  try {
    const response = await axios.get(url, {
      params: {
        api_token: SPORTMONKS_API_KEY,
        ...params,
      },
      headers: {
        Accept: "application/json",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

app.get("/api/fixtures", (req, res) => {
  handleApiRequest(
    `${SPORTMONKS_BASE_URL}/fixtures`,
    { include: "participants", ...req.query },
    res
  );
});

app.get("/api/fixtures/:id", (req, res) => {
  handleApiRequest(
    `${SPORTMONKS_BASE_URL}/fixtures/${req.params.id}`,
    { include: "participants,events,statistics", ...req.query },
    res
  );
});

app.get("/api/fixtures/between", (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Start and end dates are required" });
  }
  handleApiRequest(
    `${SPORTMONKS_BASE_URL}/fixtures/between/${startDate}/${endDate}`,
    { include: "participants", league_id: 8 },
    res
  );
});

app.get("/api/fixtures/scotland", (req, res) => {
  handleApiRequest(
    `${SPORTMONKS_BASE_URL}/fixtures`,
    { include: "participants", league_id: 501 },
    res
  );
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
