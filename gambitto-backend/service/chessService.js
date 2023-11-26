const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const { User, ChessGame, GameStatus, ChessMove } = require("../models");
const { Chess } = require("chess.js");
const { STARTING_POSITION } = require("../constants");

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
    return {newGame, sttus: invitationStatus};
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
    return {game, status: inProgressStatus};
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
    return {game, status: declinedStatus};
  }

  async getGameById(gameId, userId) {
    const game = await ChessGame.findOne({where: {id: gameId, [Op.or]: [{senderId: userId}, {inviteeId: userId}]}});
    if (!game) {
      throw ApiError.badRequest('no such game');
    }
    const gameStatus = await GameStatus.findOne({where: {id: game.gameStatusId}});
    const gameMoves = await ChessMove.findAll({where: {chessGameId: gameId}});
    return {game, gameMoves, sttaus: gameStatus}
  }

  async makeMove(moveCode, userId, gameId) {
    const inProgressStatus = await GameStatus.findOne({where: {status: 'inProgress'}});
    const game = await ChessGame.findOne({where: {id: gameId, gameStatusId: inProgressStatus.id, [Op.or]: [{senderId: userId}, {inviteeId: userId}]}});
    if (!game) {
      throw ApiError.badRequest('no such game');
    }
    const lastMove = await ChessMove.findOne({where: {chessGameId: gameId}, order: [['createdAt', 'DESC']]});
    let positionBefore = !!lastMove ? lastMove.positionBefore : STARTING_POSITION;
    const chess = new Chess(positionBefore);
    if (!!lastMove) {
      chess.move(lastMove.moveCode);
      positionBefore = chess.fen();
    }
    // move validation
    const curTurn = chess.turn();
    if (curTurn === 'w' && userId !== game.whitePlayerId || curTurn === 'b' && userId !== game.blackPlayerId) {
      throw ApiError.badRequest('not valid user');
    }
    try {
      chess.move(moveCode);
    } catch (error) {
      throw ApiError.badRequest(error.message)
    }
    const newMove = await ChessMove.create({moveNumber: !!lastMove ? lastMove.moveNumber + 1 : 1, moveCode, positionBefore, userId, chessGameId: gameId});
    // check for game end
    let gameStatus;
    if (chess.isCheckmate()) {
      gameStatus = curTurn === 'w' ? await GameStatus.findOne({where: {status: 'whiteWin'}}) : await GameStatus.findOne({where: {status: 'blackWin'}});
      game.gameStatusId = gameStatus.id;
      game.save();
    }
    if (chess.isDraw()) {
      gameStatus = await GameStatus.findOne({where: {status: 'draw'}});
      game.gameStatusId = gameStatus.id;
      game.save();
    }
    if (chess.isStalemate()) {
      gameStatus = await GameStatus.findOne({where: {status: 'stalemate'}});
      game.gameStatusId = gameStatus.id;
      game.save();
    }
    return {game, newMove, status: gameStatus}
  }

  async resign(gameId, userId) {
    const inProgressStatus = await GameStatus.findOne({where: {status: 'inProgress'}});
    const game = await ChessGame.findOne({where: {id: gameId, gameStatusId: inProgressStatus.id, [Op.or]: [{senderId: userId}, {inviteeId: userId}]}});
    if (!game) {
      throw ApiError.badRequest('no such game');
    }
    let gameStatus;
    if (userId === game.whitePlayerId) {
      gameStatus = await GameStatus.findOne({where: {status: 'whiteWin'}});
    }
    if (userId === game.blackPlayerId) {
      gameStatus = await GameStatus.findOne({where: {status: 'blackWin'}});
    };
    game.gameStatusId = gameStatus.id;
    game.save();
    return {game, status: gameStatus};
  }
  
}

module.exports = new ChessService();