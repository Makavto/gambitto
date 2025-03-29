const sequalize = require('../db');
const {DataTypes} = require('sequelize');

const RatingsHistory = sequalize.define('ratingsHistory', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    chessGameId: {type: DataTypes.INTEGER, allowNull: false},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    rating: {type: DataTypes.INTEGER, allowNull: false},
    ratingDelta: {type: DataTypes.INTEGER, allowNull: false},
});

module.exports = RatingsHistory
