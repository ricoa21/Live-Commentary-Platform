require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");

const sequelize = require("./config/database");
const User = require("./models/User")(sequelize);
const Comment = require("./models/Comment")(sequelize);

User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());

// Auth routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// SportMonks API setup
const SPORTMONKS_BASE_URL =
  "https://api.sportmonks.com/v3/football/fixtures/upcoming/markets";
const SPORTMONKS_API_KEY = process.env.SPORTMONKS_API_KEY;

// PUBLIC endpoint for Danish Superliga fixtures
app.get("/api/fixtures/danish", async (req, res) => {
  try {
    if (!SPORTMONKS_API_KEY) {
      return res.status(500).json({ error: "SportMonks API key not set" });
    }
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
        validateStatus: (status) => status < 500,
      }
    );

    if (fixturesResponse.status !== 200) {
      return res.status(fixturesResponse.status).json({
        error: "Failed to fetch fixtures",
        details: fixturesResponse.data,
      });
    }

    const validFixtures = (fixturesResponse.data.data || []).filter(
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
    console.error(
      "Error fetching fixtures:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to fetch fixtures",
      details: error.response?.data || error.message,
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

  socket.on("request_fixture_updates", (fixtureId) => {
    console.log(`Client requested updates for fixture ID ${fixtureId}`);

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
    }, 30000);

    socket.on("disconnect", () => {
      clearInterval(interval);
      console.log(`User disconnected: ${socket.id}`);
    });
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

app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
});

module.exports = app;
