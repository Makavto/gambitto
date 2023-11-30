const { Friendship, FriendshipStatus } = require("../models");
const chessService = require("../service/chessService");
const {Op} = require("sequelize");

module.exports = class UserSearchDto {
  id;
  createdAt;
  username;
  wins;
  totalGames;
  friendshipStatus;
  friendshipStatusFromatted;

  constructor(userModel, userId) {
    return (async () => {
      const games = await chessService.getUserGames(userModel.id);
      const friendship = await Friendship.findOne({where: {[Op.or]: [{senderId: userModel.id, inviteeId: userId}, {inviteeId: userModel.id, senderId: userId}]}});
      let friendshipStatus = null;
      let friendshipStatusFromatted = null;
      if (!!friendship) {
        const friendshipStatusModel = await FriendshipStatus.findOne({where: {id: friendship.friendshipStatusId}});
        friendshipStatus = friendshipStatusModel.status;
        friendshipStatusFromatted = friendshipStatusModel.statusFormatted;
      }
      let wins = 0;
      games.forEach((game) => {
        if (game.gameStatus === 'blackWin' && game.blackPlayerId === userModel.id) wins++;
        if (game.gameStatus === 'whiteWin' && game.whitePlayerId === userModel.id) wins++;        
      });
      this.id = userModel.id;
      this.createdAt = userModel.createdAt;
      this.username = userModel.username;
      this.wins = wins;
      this.totalGames = games.length;
      this.friendshipStatus = friendshipStatus;
      this.friendshipStatusFromatted = friendshipStatusFromatted;
      return this
    })();
  }
}