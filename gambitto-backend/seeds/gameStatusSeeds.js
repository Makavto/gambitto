const GameStatus = require('../models/GameStatus');
const { GAME_STATUSES } = require('../constants');

const makeGameStatusSeeds = async () => {
  GAME_STATUSES.forEach(async (items) => {
    console.log(items)
    await GameStatus.create({status: items.status, statusFormatted: items.statusFormatted});
  })
}

module.exports = makeGameStatusSeeds;