const sequalize = require('../db');
const {DataTypes} = require('sequelize');

const Friendship = sequalize.define('friendships', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

module.exports = Friendship

