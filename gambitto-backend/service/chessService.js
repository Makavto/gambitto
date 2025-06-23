const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
const {
  User,
  ChessGame,
  GameStatus,
  ChessMove,
  GameType,
} = require("../models");
const { Chess } = require("chess.js");
const {
  STARTING_POSITION,
  MAX_OPPONENTS_RATING_RANGE,
} = require("../constants");
const ChessGameDto = require("../dtos/chessGameDto");
const ChessGameFullInfoDto = require("../dtos/chessGameFullInfoDto");
const ratingService = require("./ratingService");
const chessClients = require("../wss clients/chessClients");

class ChessService {
  // Отправка приглашения на игру другому пользователю
  async sendInvitation(senderId, inviteeId) {
    const sender = await User.findOne({ where: { id: senderId } });
    const invitee = await User.findOne({ where: { id: inviteeId } });
    if (!sender || !invitee || sender.id === invitee.id) {
      throw ApiError.badRequest("invalid user id");
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
    const invitationStatus = await GameStatus.findOne({
      where: { status: "invitation" },
    });
    const gameType = await GameType.findOne({
      where: { type: "friendly" },
    });
    const newGame = await ChessGame.create({
      blackPlayerId,
      whitePlayerId,
      gameStatusId: invitationStatus.id,
      senderId,
      inviteeId,
      gameTypeId: gameType.id
    });
    return await new ChessGameDto(newGame);
  }

  // Поиск рейтинговой игры с подходящим соперником
  async startGameSearch(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw ApiError.badRequest("invalid user id");
    }
    let newGame = null;
    for (let chessClient of chessClients) {
      if (
        chessClient.isRatingGameSearch &&
        Math.abs(chessClient.user.rating - user.rating) <=
          MAX_OPPONENTS_RATING_RANGE
      ) {
        const inProgressStatus = await GameStatus.findOne({
          where: { status: "inProgress" },
        });
        const ratingGameType = await GameType.findOne({
          where: { type: "rating" },
        });
        let blackPlayerId;
        let whitePlayerId;
        const senderId = userId;
        const inviteeId = chessClient.user.id;
        if (Math.round(Math.random()) < 0.5) {
          blackPlayerId = senderId;
          whitePlayerId = inviteeId;
        } else {
          blackPlayerId = inviteeId;
          whitePlayerId = senderId;
        }
        newGame = await ChessGame.create({
          blackPlayerId,
          whitePlayerId,
          gameStatusId: inProgressStatus.id,
          senderId,
          inviteeId,
          gameTypeId: ratingGameType.id
        });
        break;
      }
    }
    if (newGame) {
      return await new ChessGameDto(newGame);
    } else {
      for (let chessClient of chessClients) {
        if (chessClient.user.id === userId) {
          chessClient.isRatingGameSearch = true;
          break;
        }
      }
      return null;
    }
  }

  // Прекращение поиска рейтинговой игры
  async endGameSearch(userId) {
    for (let chessClient of chessClients) {
      if (chessClient.user.id === userId) {
        chessClient.isRatingGameSearch = false;
        break;
      }
    }
    return null;
  }

  // Получение списка всех игр пользователя
  async getUserGames(userId) {
    const games = await ChessGame.findAll({
      where: { [Op.or]: [{ senderId: userId }, { inviteeId: userId }] },
      order: [["createdAt", "DESC"]],
    });
    if (games.length === 0 || !games) return [];
    return await Promise.all(
      games.map(async (game) => {
        return await new ChessGameDto(game);
      })
    );
  }

  // Принятие приглашения на игру
  async acceptInvitation(gameId, userId) {
    const game = await ChessGame.findOne({
      where: { id: gameId, inviteeId: userId },
    });
    if (!game) {
      throw ApiError.badRequest("no such game");
    }
    const invitationStatus = await GameStatus.findOne({
      where: { status: "invitation" },
    });
    if (game.gameStatusId !== invitationStatus.id) {
      throw ApiError.badRequest("not able to accept this game");
    }
    const inProgressStatus = await GameStatus.findOne({
      where: { status: "inProgress" },
    });
    game.gameStatusId = inProgressStatus.id;
    game.save();
    return await new ChessGameDto(game);
  }

  // Отклонение приглашения на игру
  async declineInvitation(gameId, userId) {
    const game = await ChessGame.findOne({
      where: { id: gameId, inviteeId: userId },
    });
    if (!game) {
      throw ApiError.badRequest("no such game");
    }
    const invitationStatus = await GameStatus.findOne({
      where: { status: "invitation" },
    });
    if (game.gameStatusId !== invitationStatus.id) {
      throw ApiError.badRequest("not able to decline this game");
    }
    const declinedStatus = await GameStatus.findOne({
      where: { status: "declined" },
    });
    game.gameStatusId = declinedStatus.id;
    game.save();
    return await new ChessGameDto(game);
  }

  // Получение полной информации об игре по её ID
  async getGameById(gameId, userId) {
    const game = await ChessGame.findOne({
      where: {
        id: gameId,
      },
    });
    if (!game) {
      throw ApiError.badRequest("no such game");
    }
    return await new ChessGameFullInfoDto(game);
  }

  // Выполнение хода в игре
  async makeMove(moveCode, userId, gameId) {
    const inProgressStatus = await GameStatus.findOne({
      where: { status: "inProgress" },
    });
    const game = await ChessGame.findOne({
      where: {
        id: gameId,
        gameStatusId: inProgressStatus.id,
        [Op.or]: [{ senderId: userId }, { inviteeId: userId }],
      }
    });
    if (!game) {
      throw ApiError.badRequest("no such game");
    }
    const gameType = await GameType.findOne({
      where: { id: game.gameTypeId }
    });
    const lastMove = await ChessMove.findOne({
      where: { chessGameId: gameId },
      order: [["createdAt", "DESC"]],
    });
    let positionBefore = !!lastMove
      ? lastMove.positionBefore
      : STARTING_POSITION;
    const chess = new Chess(positionBefore);
    if (!!lastMove) {
      chess.move(lastMove.moveCode);
      positionBefore = chess.fen();
    }
    // move validation
    const curTurn = chess.turn();
    if (
      (curTurn === "w" && userId !== game.whitePlayerId) ||
      (curTurn === "b" && userId !== game.blackPlayerId)
    ) {
      throw ApiError.badRequest("not valid user");
    }
    try {
      chess.move(moveCode);
    } catch (error) {
      throw ApiError.badRequest(error.message);
    }
    const newMove = await ChessMove.create({
      moveNumber: !!lastMove ? lastMove.moveNumber + 1 : 1,
      moveCode,
      positionBefore,
      userId,
      chessGameId: gameId,
    });
    // check for game end
    let gameStatus;
    if (chess.isCheckmate()) {
      if (curTurn === "w") {
        if (gameType.type === "rating") {
          await ratingService.countNewRating(game, 1);
        }
        gameStatus = await GameStatus.findOne({
          where: { status: "whiteWin" },
        });
      } else {
        if (gameType.type === "rating") {
          await ratingService.countNewRating(game, 0);
        }
        gameStatus = await GameStatus.findOne({
          where: { status: "blackWin" },
        });
      }
      game.gameStatusId = gameStatus.id;
      game.save();
    }
    if (chess.isThreefoldRepetition()) {
      if (gameType.type === "rating") {
        await ratingService.countNewRating(game, 0.5);
      }
      gameStatus = await GameStatus.findOne({ where: { status: "threefold" } });
      game.gameStatusId = gameStatus.id;
      game.save();
    }
    if (chess.isInsufficientMaterial()) {
      if (gameType.type === "rating") {
        await ratingService.countNewRating(game, 0.5);
      }
      gameStatus = await GameStatus.findOne({
        where: { status: "insufficient" },
      });
      game.gameStatusId = gameStatus.id;
      game.save();
    }
    if (chess.isDraw()) {
      if (gameType.type === "rating") {
        await ratingService.countNewRating(game, 0.5);
      }
      gameStatus = await GameStatus.findOne({ where: { status: "draw" } });
      game.gameStatusId = gameStatus.id;
      game.save();
    }
    if (chess.isStalemate()) {
      if (gameType.type === "rating") {
        await ratingService.countNewRating(game, 0.5);
      }
      gameStatus = await GameStatus.findOne({ where: { status: "stalemate" } });
      game.gameStatusId = gameStatus.id;
      game.save();
    }
    return await new ChessGameFullInfoDto(game);
  }

  // Сдача игры
  async resign(gameId, userId) {
    const inProgressStatus = await GameStatus.findOne({
      where: { status: "inProgress" },
    });
    const game = await ChessGame.findOne({
      where: {
        id: gameId,
        gameStatusId: inProgressStatus.id,
        [Op.or]: [{ senderId: userId }, { inviteeId: userId }],
      }
    });
    if (!game) {
      throw ApiError.badRequest("no such game");
    }
    const gameType = await GameType.findOne({
      where: { id: game.gameTypeId }
    });
    let gameStatus;
    if (userId === game.whitePlayerId) {
      if (gameType.type === "rating") {
        await ratingService.countNewRating(game, 0);
      }
      gameStatus = await GameStatus.findOne({ where: { status: "blackWin" } });
    }
    if (userId === game.blackPlayerId) {
      if (gameType.type === "rating") {
        await ratingService.countNewRating(game, 1);
      }
      gameStatus = await GameStatus.findOne({ where: { status: "whiteWin" } });
    }
    game.gameStatusId = gameStatus.id;
    game.save();
    return await new ChessGameFullInfoDto(game);
  }

  // Получение уведомлений пользователя
  async getNotifications(userId) {
    const invitationStatus = await GameStatus.findOne({
      where: { status: "invitation" },
    });
    const games = await ChessGame.findAll({
      where: { inviteeId: userId, gameStatusId: invitationStatus.id },
    });
    return await Promise.all(
      games.map(async (game) => {
        return await new ChessGameDto(game);
      })
    );
  }
}

module.exports = new ChessService();
