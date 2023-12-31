const { GameStatus, ChessMove, User } = require("../models");

module.exports = class ChessGameFullInfoDto {
  id;
  createdAt;
  senderId;
  inviteeId;
  blackPlayerId;
  whitePlayerId;
  blackPlayerName;
  whitePlayerName;
  gameStatus;
  gameStatusFormatted;
  gameMoves;

  constructor(chessGameModel) {
    return (async () => {
      const blackPlayer = await User.findOne({ where: { id: chessGameModel.blackPlayerId } });
      const whitePlayer = await User.findOne({ where: { id: chessGameModel.whitePlayerId } });
      const gameStatus = await GameStatus.findOne({where: {id: chessGameModel.gameStatusId}});
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
      this.gameMoves = await ChessMove.findAll({where: {chessGameId: chessGameModel.id}});
      return this
    })();
  }
}