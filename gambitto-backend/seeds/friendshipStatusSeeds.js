const FriendshipStatus = require('../models/FriendshipStatus');
const { FRIENDSHIP_STATUSES } = require('../constants');

const makeFriendshipStatusSeeds = async () => {
  FRIENDSHIP_STATUSES.forEach(async (items) => {
    await FriendshipStatus.create({status: items.status, statusFormatted: items.statusFormatted});
  })
}

module.exports = makeFriendshipStatusSeeds;