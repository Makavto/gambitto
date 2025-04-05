import { useEffect } from "react";
import { ChessAPI } from "../../../services/ChessService";
import { useAppSelector } from "../../../hooks/redux";

export const useChooseGamePageController = () => {
  const [getChessGames, { data: allGames, isLoading: isGamesLoading }] =
    ChessAPI.useLazyGetAllGamesQuery();

  const { chessWsReady } = useAppSelector((state) => state.wsSlice);

  useEffect(() => {
    if (chessWsReady) {
      getChessGames();
    }
  }, [chessWsReady]);

  return {
    gamesInProgress: allGames?.games.filter(
      (game) => game.gameStatus === "inProgress"
    ),
    isGamesLoading,
  };
};
