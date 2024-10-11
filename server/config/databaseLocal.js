// config/databaseLocal.js

const { Sequelize } = require("sequelize");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const localDb = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST_LOCAL,
  username: process.env.DB_USER_LOCAL,
  password: process.env.DB_PASS_LOCAL,
  database: process.env.DB_NAME_LOCAL,
  port: process.env.DB_PORT,
  timezone: "+08:00",
});

module.exports = localDb;
