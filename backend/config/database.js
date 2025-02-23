// config/database.js
const { Sequelize } = require("sequelize"); // Import Sequelize

const sequelize = new Sequelize(
  "commentary_database",
  "ricoa21",
  "Stockholm%28",
  {
    host: "localhost",
    dialect: "postgres",
  }
);

module.exports = sequelize; // Export the sequelize instance
