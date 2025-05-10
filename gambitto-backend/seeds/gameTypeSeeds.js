const { GAME_TYPES } = require('../constants');
const { GameType } = require('../models');

const makeGameTypeSeeds = async () => {
  GAME_TYPES.forEach(async (items) => {
    await GameType.create({status: items.status, statusFormatted: items.statusFormatted});
  })
}

module.exports = makeGameTypeSeeds;