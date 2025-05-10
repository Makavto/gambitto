const sequalize = require("../db");
const { DataTypes } = require("sequelize");

const GameType = sequalize.define("gameTypes", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING, allowNull: false },
  typeFormatted: { type: DataTypes.STRING, allowNull: false },
});

module.exports = GameType;
