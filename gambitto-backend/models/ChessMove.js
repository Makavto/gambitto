const sequalize = require('../db');
const {DataTypes} = require('sequelize');

const ChessMove = sequalize.define('chessMoves', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    moveNumber: {type: DataTypes.INTEGER, allowNull: false},
    moveCode: {type: DataTypes.STRING, allowNull: false},
    poitionBefore: {type:DataTypes.STRING, allowNull: false}
});

module.exports = ChessMove

