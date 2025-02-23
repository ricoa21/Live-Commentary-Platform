// config/database.js
const sequelize = new Sequelize(
  "commentary_database",
  "ricoa21",
  "Stockholm%28",
  {
    host: "localhost",
    dialect: "postgres",
  }
);

module.exports = sequelize;
