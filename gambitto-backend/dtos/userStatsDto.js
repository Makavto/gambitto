const { RatingsHistory } = require("../models");
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
  rating;
  ratingsHistory;

  constructor(userModel) {
    return (async () => {
      const games = await chessService.getUserGames(userModel.id);
      const ratingsHistory = await RatingsHistory.findAll({
        where: { userId: userModel.id },
      });
      let wins = 0;
      let defeats = 0;
      let draws = 0;
      let maxWinStreak = 0;
      let winStreak = 0;
      let defeatStreak = 0;
      let maxDefeatStreak = 0;
      const isWin = (game) =>
        (game.gameStatus === "blackWin" &&
          game.blackPlayerId === userModel.id) ||
        (game.gameStatus === "whiteWin" && game.whitePlayerId === userModel.id);
      const isDefeat = (game) =>
        (game.gameStatus === "whiteWin" &&
          game.blackPlayerId === userModel.id) ||
        (game.gameStatus === "blackWin" && game.whitePlayerId === userModel.id);
      games.forEach((game) => {
        if (isWin(game)) wins++;
        if (isDefeat(game)) defeats++;
        if (
          game.gameStatus === "draw" ||
          game.gameStatus === "stalemate" ||
          game.gameStatus === "threefold" ||
          game.gameStatus === "insufficient"
        )
          draws++;
        if (isWin(game)) {
          winStreak++;
        } else {
          if (winStreak > maxWinStreak) maxWinStreak = winStreak;
          winStreak = 0;
        }
        if (isDefeat(game)) {
          defeatStreak++;
        } else {
          if (defeatStreak > maxDefeatStreak) maxDefeatStreak = defeatStreak;
          defeatStreak = 0;
        }
      });
      if (winStreak > maxWinStreak) {
        maxWinStreak = winStreak;
      }
      if (defeatStreak > maxDefeatStreak) {
        maxDefeatStreak = defeatStreak;
      }
      this.id = userModel.id;
      this.createdAt = userModel.createdAt;
      this.username = userModel.username;
      this.wins = wins;
      this.defeats = defeats;
      this.draws = draws;
      this.winStreak = maxWinStreak;
      this.defeatStreak = maxDefeatStreak;
      this.totalGames = games.length;
      this.rating = userModel.rating;
      this.ratingsHistory = ratingsHistory;
      return this;
    })();
  }
};
