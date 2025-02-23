const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define("Comment", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Comment content cannot be empty",
      },
      len: {
        args: [1, 1000],
        msg: "Comment must be between 1 and 1000 characters long",
      },
    },
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
});

module.exports = Comment;
