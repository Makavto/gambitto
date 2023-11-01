const ApiError = require("../error/ApiError");
const { User, ChessGame, GameStatus } = require("../models");

class ChessService {
  async sendInvitation(senderId, inviteeId) {
    const sender = await User.findOne({where: {id: senderId}});
    const invitee = await User.findOne({where: {id: inviteeId}});
    if (!sender || !invitee || sender.id === invitee.id) {
      throw ApiError.badRequest('invalid user id');
    }
    let blackPlayerId;
    let whitePlayerId;
    if (Math.round(Math.random()) < 0.5) {
      blackPlayerId = senderId;
      whitePlayerId = inviteeId;
    } else {
      blackPlayerId = inviteeId;
      whitePlayerId = senderId;
    }
    const invitationStatus = await GameStatus.findOne({where: {status: 'invitation'}});
    const newGame = await ChessGame.create({blackPlayerId, whitePlayerId, gameStatusId: invitationStatus.id, senderId});
    return newGame;
  }

  async acceptInvitation(gameId) {
    const game = await ChessGame.findOne({where: {id: gameId}});
    if (!game) {
      throw ApiError.badRequest('no such game');
    }
    const inProgressStatus = await GameStatus.findOne({where: {status: 'inProgress'}});
    game.gameStatusId = inProgressStatus.id;
    game.save();
    return game;
  }

  async declineInvitation(gameId) {
    const game = await ChessGame.findOne({where: {id: gameId}});
    if (!game) {
      throw ApiError.badRequest('no such game');
    }
    const declinedStatus = await GameStatus.findOne({where: {status: 'declined'}});
    game.gameStatusId = declinedStatus.id;
    game.save();
    return game;
  }
}

module.exports = new ChessService();