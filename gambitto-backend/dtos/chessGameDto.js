const { GameStatus, User } = require("../models");
const userService = require("../service/userService");
const UserDto = require("./userDto");

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
      const blackPlayer = new UserDto(await User.findOne({ where: { id: chessGameModel.blackPlayerId } }));
      const whitePlayer = new UserDto(await User.findOne({ where: { id: chessGameModel.whitePlayerId } }));
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