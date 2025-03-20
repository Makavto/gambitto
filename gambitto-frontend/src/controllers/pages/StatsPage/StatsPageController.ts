import { useEffect } from "react";
import { useParams } from "react-router";
import { useAppSelector } from "../../../hooks/redux";
import { ChessAPI } from "../../../services/ChessService";
import { UserAPI } from "../../../services/UserService";

export const useStatsPageController = () => {
  const { chessWsReady: wsReady } = useAppSelector((state) => state.wsSlice);

  const [getAllGames, { data: allGames }] = ChessAPI.useLazyGetAllGamesQuery();

  useEffect(() => {
    if (wsReady) {
      getAllGames();
    }
  }, [wsReady]);

  const { userId } = useParams();

  const { data: statsData, isLoading: isStatsLoading } =
    UserAPI.useGetUserStatsQuery(userId ? Number(userId) : undefined);

  return {
    allGames,
    statsData,
    isStatsLoading,
  };
};
