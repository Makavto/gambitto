const makeFriendshipStatusSeeds = require("./friendshipStatusSeeds");
const makeGameStatusSeeds = require("./gameStatusSeeds")

const initSeeds = async () => {
  await makeGameStatusSeeds();
  await makeFriendshipStatusSeeds();
}

module.exports = initSeeds;