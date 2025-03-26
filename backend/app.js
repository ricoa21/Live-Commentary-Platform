const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const sequelize = require("./config/database");
const axios = require("axios");

const User = require("./models/User");
const Comment = require("./models/Comment");

// Associations
Comment.belongsTo(User);
User.hasMany(Comment);

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to PostgreSQL database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

const app = express();

// Enable CORS with specific options
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const SPORTMONKS_BASE_URL = "https://api.sportmonks.com/v3/football";
const SPORTMONKS_API_KEY =
  "ygK23d0Wym1qwEEu7Zch3fEO01VzhuNltJoR1sYEsbLNxCshvjEmTY3E3beE";

app.get("/api/fixtures", async (req, res) => {
  try {
    const response = await axios.get(`${SPORTMONKS_BASE_URL}/fixtures`, {
      params: {
        api_token: SPORTMONKS_API_KEY,
        include: "participants",
        ...req.query,
      },
      headers: {
        Accept: "application/json",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
});

app.get("/api/fixtures/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${SPORTMONKS_BASE_URL}/fixtures/${req.params.id}`,
      {
        params: {
          api_token: SPORTMONKS_API_KEY,
          include: "participants,events,statistics",
          ...req.query,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching fixture ${req.params.id}:`, error);
    res.status(500).json({ error: "Failed to fetch fixture" });
  }
});

app.get("/api/fixtures/between", async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start and end dates are required" });
    }

    const response = await axios.get(
      `${SPORTMONKS_BASE_URL}/fixtures/between/${startDate}/${endDate}`,
      {
        params: {
          api_token: SPORTMONKS_API_KEY,
          include: "participants",
          league_id: 8, // Premier League ID
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.status !== 200) {
      return res.status(response.status).json({ error: response.statusText });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    if (error.response) {
      res
        .status(error.response.status)
        .json({ error: error.response.statusText });
    } else if (error.code === "ECONNABORTED") {
      res.status(408).json({ error: "Request timed out" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.get("/api/fixtures/scotland", async (req, res) => {
  try {
    const response = await axios.get(`${SPORTMONKS_BASE_URL}/fixtures`, {
      params: {
        api_token: SPORTMONKS_API_KEY,
        include: "participants",
        league_id: 501, // Scottish Premiership ID
      },
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status !== 200) {
      return res.status(response.status).json({ error: response.statusText });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
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

const PORT = 4000;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & tables created!");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("Error syncing database:", err));
