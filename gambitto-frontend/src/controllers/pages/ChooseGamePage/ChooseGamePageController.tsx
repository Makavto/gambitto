import { useEffect } from "react";
import { ChessAPI } from "../../../services/ChessService";

export const useChooseGamePageController = () => {
  const [getChessGames, { data: allGames, isLoading: isGamesLoading }] =
    ChessAPI.useLazyGetAllGamesQuery();

  useEffect(() => {
    getChessGames();
  }, []);

  return {
    gamesInProgress: allGames?.games.filter(
      (game) => game.gameStatus === "inProgress"
    ),
    isGamesLoading,
  };
};
