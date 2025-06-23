const sequalize = require("../db");
const { DataTypes } = require("sequelize");

const Chat = sequalize.define("chats", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

module.exports = Chat;
