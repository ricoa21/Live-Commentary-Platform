// models/User.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "Username is required" },
        notEmpty: { msg: "Username cannot be empty" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password is required" },
        len: { args: [8], msg: "Password must be at least 8 characters" },
      },
    },
  });
};
