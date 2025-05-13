const { Op } = require("sequelize");
const { User, ChessGame, RatingsHistory } = require("../models");
const countPlayersRating = require("../utils/RatingFunction");

class RatingService {
  // Расчет нового рейтинга игроков после завершения игры
  async countNewRating(game, result) {
    const whitePlayer = await User.findOne({
      where: { id: game.whitePlayerId },
    });
    const lastWhitePlayerGame = await ChessGame.findOne({
      where: {
        [Op.or]: [
          { whitePlayerId: game.whitePlayerId },
          { blackPlayerId: game.whitePlayerId },
        ],
        [Op.not]: { id: game.id },
      },
      order: [["createdAt", "DESC"]],
    });
    const blackPlayer = await User.findOne({
      where: { id: game.blackPlayerId },
    });
    const lastBlackPlayerGame = await ChessGame.findOne({
      where: {
        [Op.or]: [
          { whitePlayerId: game.blackPlayerId },
          { blackPlayerId: game.blackPlayerId },
        ],
        [Op.not]: { id: game.id },
      },
      order: [["createdAt", "DESC"]],
    });
    const oldPlayerWhite = {
      rating: whitePlayer.rating,
      rd: whitePlayer.ratingDeviation,
      lastGame: lastWhitePlayerGame?.createdAt,
    };
    const oldPlayerBlack = {
      rating: blackPlayer.rating,
      rd: blackPlayer.ratingDeviation,
      lastGame: lastBlackPlayerGame?.createdAt,
    };
    const [newPlayerWhite, newPlayerBlack] = countPlayersRating(
      oldPlayerWhite,
      oldPlayerBlack,
      result
    );

    whitePlayer.rating = Math.round(newPlayerWhite.rating);
    whitePlayer.ratingDeviation = Math.round(newPlayerWhite.rd);
    await whitePlayer.save();
    blackPlayer.rating = Math.round(newPlayerBlack.rating);
    blackPlayer.ratingDeviation = Math.round(newPlayerBlack.rd);
    await blackPlayer.save();

    const ratingHistoryWhite = await RatingsHistory.create({
      chessGameId: game.id,
      userId: game.whitePlayerId,
      rating: Math.round(newPlayerWhite.rating),
      ratingDelta: Math.round(newPlayerWhite.delta),
    });

    const ratingHistoryBlack = await RatingsHistory.create({
      chessGameId: game.id,
      userId: game.blackPlayerId,
      rating: Math.round(newPlayerBlack.rating),
      ratingDelta: Math.round(newPlayerBlack.delta),
    });
    return {
      ratingHistoryOne: ratingHistoryWhite,
      ratingHistoryTwo: ratingHistoryBlack,
    };
  }
}

module.exports = new RatingService();
