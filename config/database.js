// config/database.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("commentary_database", "postgres", null, {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;
