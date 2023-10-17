require('dotenv').config()
const express = require('express');
const sequelize = require('./db');
const models = require('./models/index');
const createRelations = require('./models/relations');
const cors = require('cors');
const router = require('./routes/index');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router);

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