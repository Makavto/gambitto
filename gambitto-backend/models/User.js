const sequalize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequalize.define('users', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, allowNull: false, unique: true},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    refreshToken: {type: DataTypes.STRING, allowNull: false}
});

module.exports = User

