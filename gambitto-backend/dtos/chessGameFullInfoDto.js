const {
  GameStatus,
  ChessMove,
  User,
  RatingsHistory,
  GameType,
} = require("../models");

module.exports = class ChessGameFullInfoDto {
  id;
  createdAt;
  senderId;
  inviteeId;
  blackPlayerId;
  whitePlayerId;
  blackPlayerName;
  whitePlayerName;
  blackPlayerRating;
  whitePlayerRating;
  blackPlayerDelta;
  whitePlayerDelta;
  gameStatus;
  gameStatusFormatted;
  gameType;
  gameTypeFormatted;
  gameMoves;

  constructor(chessGameModel) {
    return (async () => {
      const blackPlayer = await User.findOne({
        where: { id: chessGameModel.blackPlayerId },
      });
      const whitePlayer = await User.findOne({
        where: { id: chessGameModel.whitePlayerId },
      });
      const gameStatus = await GameStatus.findOne({
        where: { id: chessGameModel.gameStatusId },
      });
      const gameType = await GameType.findOne({
        where: { id: chessGameModel.gameTypeId },
      });
      try {
        const whitePlayerRating = await RatingsHistory.findOne({
          where: {
            chessGameId: chessGameModel.id,
            userId: chessGameModel.whitePlayerId,
          },
        });
        const blackPlayerRating = await RatingsHistory.findOne({
          where: {
            chessGameId: chessGameModel.id,
            userId: chessGameModel.blackPlayerId,
          },
        });
        this.blackPlayerRating = blackPlayerRating?.rating;
        this.whitePlayerRating = whitePlayerRating?.rating;
        this.blackPlayerDelta = blackPlayerRating?.ratingDelta;
        this.whitePlayerDelta = whitePlayerRating?.ratingDelta;
      } catch (error) {}
      this.id = chessGameModel.id;
      this.createdAt = chessGameModel.createdAt;
      this.senderId = chessGameModel.senderId;
      this.inviteeId = chessGameModel.inviteeId;
      this.blackPlayerId = chessGameModel.blackPlayerId;
      this.whitePlayerId = chessGameModel.whitePlayerId;
      this.blackPlayerName = blackPlayer.username;
      this.whitePlayerName = whitePlayer.username;
      this.gameStatusFormatted = gameStatus.statusFormatted;
      this.gameStatus = gameStatus.status;
      this.gameMoves = await ChessMove.findAll({
        where: { chessGameId: chessGameModel.id },
      });
      this.gameType = gameType.type;
      this.gameTypeFormatted = gameType.typeFormatted;
      return this;
    })();
  }
};
