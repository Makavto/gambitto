const { Sequelize } = require("sequelize");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false
  }
);
