const sequalize = require('../db');
const {DataTypes} = require('sequelize');

const ChessGame = sequalize.define('chessGames', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    senderId: {type: DataTypes.INTEGER, allowNull: false}
});

module.exports = ChessGame
