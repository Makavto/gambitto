const chessService = require("../service/chessService");

module.exports = class UserTopDto {
  id;
  createdAt;
  username;
  wins;
  totalGames;

  constructor(userModel) {
    return (async () => {
      const games = await chessService.getUserGames(userModel.id);
      let wins = 0;
      games.forEach((game) => {
        if (game.gameStatus === 'blackWin' && game.blackPlayerId === userModel.id) wins++;
        if (game.gameStatus === 'whiteWin' && game.whitePlayerId === userModel.id) wins++;        
      });
      this.id = userModel.id;
      this.createdAt = userModel.createdAt;
      this.username = userModel.username;
      this.wins = wins;
      this.totalGames = games.length;
      return this
    })();
  }
}