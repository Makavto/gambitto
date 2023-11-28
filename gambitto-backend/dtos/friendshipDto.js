const { GameStatus, FriendshipStatus } = require("../models");
const userService = require("../service/userService");

module.exports = class FriendshipDto {
  id;
  createdAt;
  senderId;
  inviteeId;
  senderName;
  inviteeName;
  friendshipStatus;
  friendshipStatusFormatted;

  constructor(friendshipModel) {
    return (async () => {
      const sender = await userService.getUserById(friendshipModel.senderId);
      const invitee = await userService.getUserById(friendshipModel.inviteeId);
      const friendshipStatus = await FriendshipStatus.findOne({where: {id: friendshipModel.friendshipStatusId}})
      this.id = friendshipModel.id;
      this.createdAt = friendshipModel.createdAt;
      this.senderId = friendshipModel.senderId;
      this.inviteeId = friendshipModel.inviteeId;
      this.senderName = sender.username;
      this.inviteeName = invitee.username;
      this.friendshipStatusFormatted = friendshipStatus.statusFormatted;
      this.friendshipStatus = friendshipStatus.status;
      return this
    })();
  }
}