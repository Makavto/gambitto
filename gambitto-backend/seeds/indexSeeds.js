const makeFriendshipStatusSeeds = require("./friendshipStatusSeeds");
const makeGameStatusSeeds = require("./gameStatusSeeds");
const makeMockUsersSeeds = require("./mockUsersSeeds");
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const initSeeds = async () => {
  await makeGameStatusSeeds();
  await makeFriendshipStatusSeeds();
  // if (process.env.NODE_ENV === 'test') {
  //   await makeMockUsersSeeds();
  // }
}

module.exports = initSeeds;