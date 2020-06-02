const Sequelize = require("sequelize");
const db = require("../config/dbconfig");

const User = db.define(
  "user",
  {
    name: {
      type: Sequelize.STRING,
    },
    mobile_number: {
      type: Sequelize.STRING,
    },
    device_id: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    loggedIn: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = User;
