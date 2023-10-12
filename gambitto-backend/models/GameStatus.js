const sequalize = require('../db');
const {DataTypes} = require('sequelize');

const GameStatus = sequalize.define('gameStatuses', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    status: {type: DataTypes.STRING, allowNull: false}
});

module.exports = GameStatus

