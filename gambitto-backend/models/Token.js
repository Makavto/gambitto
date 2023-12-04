const sequalize = require('../db');
const {DataTypes} = require('sequelize');

const Token = sequalize.define('tokens', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refreshToken: {type: DataTypes.TEXT, allowNull: false}
});

module.exports = Token