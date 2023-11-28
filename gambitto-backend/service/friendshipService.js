const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");
const { Friendship, FriendshipStatus } = require("../models");
const FriendshipDto = require("../dtos/friendshipDto");

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
    return await new FriendshipDto(friendship);
  }

  async acceptFriend(invitationId, inviteeId) {
    const acceptedStatus = await FriendshipStatus.findOne({where: {status: 'friends'}});
    const invitationStatus = await FriendshipStatus.findOne({where: {status: 'invitation'}});
    const friendship = await Friendship.findOne({where: {id: invitationId, inviteeId, friendshipStatusId: invitationStatus.id}});
    if (!friendship) throw ApiError.badRequest('no such friendship');
    friendship.friendshipStatusId = acceptedStatus.id;
    friendship.save();
    return await new FriendshipDto(friendship);
  }

  async declineFriend(invitationId, inviteeId) {
    const invitationStatus = await FriendshipStatus.findOne({where: {status: 'invitation'}});
    const friendship = await Friendship.findOne({where: {id: invitationId, inviteeId, friendshipStatusId: invitationStatus.id}});
    if (!friendship) throw ApiError.badRequest('no such friendship');
    friendship.destroy();
    return await new FriendshipDto(friendship);
  }

  async getUserFriends(userId) {
    const friendships = await Friendship.findAll({where: {[Op.or]: [{senderId: userId}, {inviteeId: userId}]}});
    return await Promise.all(friendships.map(async (friendship) => {
      return await new FriendshipDto(friendship);
    }))
  }

  async deleteFriend(invitationId, userId) {
    const acceptedStatus = await FriendshipStatus.findOne({where: {status: 'friends'}});
    const friendship = await Friendship.findOne({where: {id: invitationId, friendshipStatusId: acceptedStatus.id, [Op.or]: [{senderId: userId}, {inviteeId: userId}]}});
    if (!friendship) {
      throw ApiError.badRequest('no such friendship')
    }
    friendship.destroy();
    return await new FriendshipDto(friendship);
  }
}

module.exports = new FrienshipService();