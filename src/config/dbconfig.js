const Sequelize = require("sequelize");
module.exports = new Sequelize("chat_app", "mehank", "mehankjain16.", {
  host: "aws-mysql.c1pcxrrxe4gq.us-east-2.rds.amazonaws.com",
  dialect: "mysql",
  operatorAliases: 0,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
