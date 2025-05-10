const { GameStatus, User, GameType } = require("../models");
const userService = require("../service/userService");
const UserDto = require("./userDto");

module.exports = class ChessGameDto {
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
  gameType;
  gameTypeFormatted;

  constructor(chessGameModel) {
    return (async () => {
      const blackPlayer = new UserDto(
        await User.findOne({ where: { id: chessGameModel.blackPlayerId } })
      );
      const whitePlayer = new UserDto(
        await User.findOne({ where: { id: chessGameModel.whitePlayerId } })
      );
      const gameStatus = await GameStatus.findOne({
        where: { id: chessGameModel.gameStatusId },
      });
      const gameType = await GameType.findOne({
        where: { id: chessGameModel.gameTypeId },
      });
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
      this.gameType = gameType.type;
      this.gameTypeFormatted = gameType.typeFormatted;
      return this;
    })();
  }
};
