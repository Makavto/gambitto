const makeFriendshipStatusSeeds = require("./friendshipStatusSeeds");
const makeGameStatusSeeds = require("./gameStatusSeeds");
const makeGameTypeSeeds = require("./gameTypeSeeds");
const makeMockUsersSeeds = require("./mockUsersSeeds");
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const initSeeds = async () => {
  await makeGameStatusSeeds();
  await makeFriendshipStatusSeeds();
  await makeGameTypeSeeds();
//   if (process.env.NODE_ENV === 'test') {
//     await makeMockUsersSeeds();
//   }
}

module.exports = initSeeds;