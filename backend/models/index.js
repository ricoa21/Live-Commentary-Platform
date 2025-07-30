const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Import and initialize models
const User = require("./User")(sequelize, DataTypes);
const Comment = require("./Comment")(sequelize, DataTypes);

// Define associations if any
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Comment,
};
