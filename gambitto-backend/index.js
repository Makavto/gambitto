require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const express = require('express');
const sequelize = require('./db');
const models = require('./models/index');
const createRelations = require('./models/relations');
const cors = require('cors');
const router = require('./routes/index');
const initSeeds = require('./seeds/indexSeeds');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 8080;

const app = express();
const WSServer = require('express-ws')(app);

app.use(cookieParser());
app.use(express.json());
app.use('/api', router);

// Обработка ошибок, всегда последний мидлвар!!!
app.use(errorHandler)

const start = async () => {
    try {
        createRelations();
        await sequelize.authenticate();
        await sequelize.sync({force: process.env.RESET_TABLE === 'true' ? true : false});
        if (process.env.RESET_TABLE === 'true') {
            await initSeeds();
        }
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error)
    }
}

start()

module.exports = app;