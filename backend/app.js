const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth.routes");

const User = require("./models/User");
const Comment = require("./models/Comment");

Comment.belongsTo(User);
User.hasMany(Comment);

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
app.use(cors());

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("new_comment", async (commentData) => {
    try {
      const { content, userId } = commentData;
      const comment = await Comment.create({ content, UserId: userId });
      const commentWithUser = await Comment.findByPk(comment.id, {
        include: [{ model: User, attributes: ["username"] }],
      });
      io.emit("comment_received", commentWithUser);
    } catch (error) {
      console.error("Error saving comment:", error);
    }
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
