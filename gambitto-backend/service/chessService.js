const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const { User, ChessGame, GameStatus, ChessMove } = require("../models");

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
    const newGame = await ChessGame.create({blackPlayerId, whitePlayerId, gameStatusId: invitationStatus.id, senderId, inviteeId});
    return newGame;
  }

  async getUserGames(userId) {
    const games = await ChessGame.findAll({where: {[Op.or]: [{senderId: userId}, {inviteeId: userId}]}});
    return games;
  }

  async acceptInvitation(gameId, userId) {
    const game = await ChessGame.findOne({where: {id: gameId, inviteeId: userId}});
    if (!game) {
      throw ApiError.badRequest('no such game');
    }
    const invitationStatus = await GameStatus.findOne({where: {status: 'invitation'}});
    if (game.gameStatusId !== invitationStatus.id) {
      throw ApiError.badRequest('not able to accept this game');
    }
    const inProgressStatus = await GameStatus.findOne({where: {status: 'inProgress'}});
    game.gameStatusId = inProgressStatus.id;
    game.save();
    return game;
  }

  async declineInvitation(gameId, userId) {
    const game = await ChessGame.findOne({where: {id: gameId, inviteeId: userId}});
    if (!game) {
      throw ApiError.badRequest('no such game');
    }
    const invitationStatus = await GameStatus.findOne({where: {status: 'invitation'}});
    if (game.gameStatusId !== invitationStatus.id) {
      throw ApiError.badRequest('not able to decline this game');
    }
    const declinedStatus = await GameStatus.findOne({where: {status: 'declined'}});
    game.gameStatusId = declinedStatus.id;
    game.save();
    return game;
  }

  async getGameById(gameId, userId) {
    const game = await ChessGame.findOne({where: {id: gameId, [Op.or]: [{senderId: userId}, {inviteeId: userId}]}});
    if (!game) {
      throw ApiError.badRequest('no such game');
    }
    const gameMoves = await ChessMove.findAll({where: {chessGameId: gameId}});
    return {game, gameMoves}
  }

  async makeMove(moveCode, positionBefore, userId, gameId) {
    const inProgressStatus = await GameStatus.findOne({where: {status: 'inProgress'}});
    const game = await ChessGame.findOne({where: {id: gameId, gameStatusId: inProgressStatus.id, [Op.or]: [{senderId: userId}, {inviteeId: userId}]}});
    if (!game) {
      throw ApiError.badRequest('no such game');
    }
    const lastMove = await ChessMove.findOne({where: {chessGameId: gameId}, order: [['createdAt', 'DESC']]});
    const newMove = await ChessMove.create({moveNumber: !!lastMove ? lastMove.moveNumber + 1 : 1, moveCode, positionBefore, userId, chessGameId: gameId});
    return {game, newMove}
  }
  
}

module.exports = new ChessService();