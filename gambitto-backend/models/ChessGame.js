const sequalize = require('../db');
const {DataTypes} = require('sequelize');

const ChessGame = sequalize.define('chessGames', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

module.exports = ChessGame
