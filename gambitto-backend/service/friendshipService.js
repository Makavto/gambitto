const { Friendship, FriendshipStatus } = require("../models");

class FrienshipService {
  async addFriend(userId, inviteeId) {
    try {
      const invitationStatus = await FriendshipStatus.findOne({where: {status: 'invitation'}});
      const friendship = await Friendship.create({senderId: userId, inviteeId, friendshipStatusId: invitationStatus.id});
      return {...friendship, ...invitationStatus};
      
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new FrienshipService();