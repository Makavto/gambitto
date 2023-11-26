const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");
const { Friendship, FriendshipStatus } = require("../models");

class FrienshipService {
  async addFriend(userId, inviteeId) {
    if (userId === inviteeId) {
      throw ApiError.badRequest('cannot be friend with yourself');
    }
    if (await Friendship.findOne({where: {[Op.or]: [{senderId: userId, inviteeId}, {inviteeId: userId, senderId: inviteeId}]}})) {
      throw ApiError.badRequest('already friends');
    }
    const invitationStatus = await FriendshipStatus.findOne({where: {status: 'invitation'}});
    const friendship = await Friendship.create({senderId: userId, inviteeId, friendshipStatusId: invitationStatus.id});
    return {friendship, status: invitationStatus};
  }

  async acceptFriend(invitationId, inviteeId) {
    const acceptedStatus = await FriendshipStatus.findOne({where: {status: 'friends'}});
    const invitationStatus = await FriendshipStatus.findOne({where: {status: 'invitation'}});
    const friendship = await Friendship.findOne({where: {id: invitationId, inviteeId, friendshipStatusId: invitationStatus.id}});
    if (!friendship) throw ApiError.badRequest('no such friendship');
    friendship.friendshipStatusId = acceptedStatus.id;
    friendship.save();
    return {friendship, status: acceptedStatus};
  }

  async declineFriend(invitationId, inviteeId) {
    const invitationStatus = await FriendshipStatus.findOne({where: {status: 'invitation'}});
    const friendship = await Friendship.findOne({where: {id: invitationId, inviteeId, friendshipStatusId: invitationStatus.id}});
    if (!friendship) throw ApiError.badRequest('no such friendship');
    friendship.destroy();
    return {friendship};
  }

  async getUserFriends(userId) {
    const friendships = await Friendship.findAll({where: {[Op.or]: [{senderId: userId}, {inviteeId: userId}]}});
    return friendships
  }

  async deleteFriend(invitationId, userId) {
    const acceptedStatus = await FriendshipStatus.findOne({where: {status: 'friends'}});
    const friendship = await Friendship.findOne({where: {id: invitationId, friendshipStatusId: acceptedStatus.id, [Op.or]: [{senderId: userId}, {inviteeId: userId}]}});
    if (!friendship) {
      throw ApiError.badRequest('no such friendship')
    }
    friendship.destroy();
    return {friendship}
  }
}

module.exports = new FrienshipService();