require('dotenv').config()
const express = require('express');
const sequelize = require('./db');
const models = require('./models/index');
const createRelations = require('./models/relations');

const PORT = process.env.PORT || 8080;

const app = express();

const start = async () => {
    try {
        createRelations();
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
        
    } catch (error) {
        console.log(error)
    }
}

start()