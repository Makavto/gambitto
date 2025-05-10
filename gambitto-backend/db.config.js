// db.config.js
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  logging: true
};
