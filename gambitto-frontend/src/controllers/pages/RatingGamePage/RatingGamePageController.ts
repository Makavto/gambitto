import { useEffect } from "react";
import { ChessAPI } from "../../../services/ChessService";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../../hooks/redux";

export const useRatingGamePageController = () => {
  const [startGameSearch, { data: newGame }] =
    ChessAPI.useLazyStartRatingGameSearchQuery();
  const [endGameSearch] = ChessAPI.useLazyEndRatingGameSearchQuery();

  const navigate = useNavigate();
  const { chessWsReady } = useAppSelector((state) => state.wsSlice);

  useEffect(() => {
    if (newGame?.game) {
      navigate(`/chess/game/${newGame.game.id}`);
    }
  }, [newGame]);

  useEffect(() => {
    if (chessWsReady) {
      startGameSearch();
    }
    return () => {
      endGameSearch();
    };
  }, [chessWsReady]);
};
