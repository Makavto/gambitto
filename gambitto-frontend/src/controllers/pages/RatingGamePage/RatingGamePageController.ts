import { useEffect } from "react";
import { ChessAPI } from "../../../services/ChessService";
import { useNavigate } from "react-router";

export const useRatingGamePageController = () => {
  const [startGameSearch, { data: newGame }] =
    ChessAPI.useLazyStartRatingGameSearchQuery();
  const [endGameSearch] = ChessAPI.useLazyEndRatingGameSearchQuery();

  const navigate = useNavigate();

  useEffect(() => {
    if (newGame?.game) {
      navigate(`/chess/game/${newGame.game.id}`);
    }
  }, [newGame]);

  useEffect(() => {
    startGameSearch();
    return () => {
      endGameSearch();
    };
  }, []);
};
