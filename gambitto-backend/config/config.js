// config/config.js
const config = require("../db.config");

module.exports = {
  dev: config,
  test: config,
  prod: config
};
