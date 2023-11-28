const { GameStatus } = require("../models");
const userService = require("../service/userService");

module.exports = class ChessGameDto {
  id;
  createdAt;
  blackPlayerId;
  whitePlayerId;
  blackPlayerName;
  whitePlayerName;
  gameStatus;
  gameStatusFormatted;

  constructor(chessGameModel) {
    return (async () => {
      const blackPlayer = await userService.getUserById(chessGameModel.blackPlayerId);
      const whitePlayer = await userService.getUserById(chessGameModel.whitePlayerId);
      const gameStatus = await GameStatus.findOne({where: {id: chessGameModel.gameStatusId}})
      this.id = chessGameModel.id;
      this.createdAt = chessGameModel.createdAt;
      this.blackPlayerId = chessGameModel.blackPlayerId;
      this.whitePlayerId = chessGameModel.whitePlayerId;
      this.blackPlayerName = blackPlayer.username;
      this.whitePlayerName = whitePlayer.username;
      this.gameStatusFormatted = gameStatus.statusFormatted;
      this.gameStatus = gameStatus.status;
      return this
    })();
  }
}