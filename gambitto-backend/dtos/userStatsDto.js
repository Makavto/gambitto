const chessService = require("../service/chessService");

module.exports = class UserStatsDto {
  id;
  createdAt;
  username;
  wins;
  defeats;
  draws;
  totalGames;
  winStreak;
  defeatStreak;

  constructor(userModel) {
    return (async () => {
      const games = await chessService.getUserGames(userModel.id);
      let wins = 0;
      let defeats = 0;
      let draws = 0;
      let maxWinStreak = 0;
      let winStreak = 0;
      let defeatStreak = 0;
      let maxDefeatStreak = 0;
      games.forEach((game, i, games) => {
        if (game.gameStatus === 'blackWin' && game.blackPlayerId === userModel.id) wins++;
        if (game.gameStatus === 'whiteWin' && game.whitePlayerId === userModel.id) wins++;
        if (game.gameStatus === 'whiteWin' && game.blackPlayerId === userModel.id) defeats++;
        if (game.gameStatus === 'blackWin' && game.whitePlayerId === userModel.id) defeats++;
        if (game.gameStatus === 'draw' || game.gameStatus === 'stalemate' || game.gameStatus === 'threefold' || game.gameStatus === 'insufficient') draws++;
        if (i > 0 &&
          (games[i - 1].gameStatus === 'blackWin' && games[i].gameStatus === 'blackWin' && game.blackPlayerId === userModel.id) ||
          (games[i - 1].gameStatus === 'whiteWin' && games[i].gameStatus === 'whiteWin' && game.whitePlayerId === userModel.id)) {
          winStreak++;
        } else {
          if (winStreak > maxWinStreak) maxWinStreak = winStreak;
          winStreak = 0;
        }

        if (i > 0 &&
          (games[i - 1].gameStatus === 'blackWin' && games[i].gameStatus === 'blackWin' && game.whitePlayerId === userModel.id) ||
          (games[i - 1].gameStatus === 'whiteWin' && games[i].gameStatus === 'whiteWin' && game.blackPlayerId === userModel.id)) {
          defeatStreak++;
        } else {
          if (defeatStreak > maxDefeatStreak) maxDefeatStreak = defeatStreak;
          defeatStreak = 0;
        }
      });
      this.id = userModel.id;
      this.createdAt = userModel.createdAt;
      this.username = userModel.username;
      this.wins = wins;
      this.defeats = defeats;
      this.draws = draws;
      this.winStreak = maxWinStreak;
      this.defeatStreak = maxDefeatStreak;
      this.totalGames = games.length;
      return this
    })();
  }
}