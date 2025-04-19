const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Comment", {
    content: DataTypes.TEXT,
  });
};
