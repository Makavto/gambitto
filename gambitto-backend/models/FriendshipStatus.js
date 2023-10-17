const sequalize = require('../db');
const {DataTypes} = require('sequelize');

const FriendshipStatus = sequalize.define('friendshipStatuses', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    status: {type: DataTypes.STRING, allowNull: false},
    statusFormatted: {type: DataTypes.STRING, allowNull: false}
});

module.exports = FriendshipStatus