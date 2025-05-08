const sequelize = require("../db");
const models = require("../models/index");
const createRelations = require("../models/relations");
const initSeeds = require("../seeds/indexSeeds");

beforeAll(async () => {
  try {
    createRelations();
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    await initSeeds();
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  await sequelize.close();
});