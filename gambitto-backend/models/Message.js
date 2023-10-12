const sequalize = require('../db');
const {DataTypes} = require('sequelize');

const Message = sequalize.define('messages', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    message: {type: DataTypes.STRING, allowNull: false},
});

module.exports = Message

