import { useEffect } from "react";
import { useParams } from "react-router";
import { ChessAPI } from "../../../services/ChessService";
import { UserAPI } from "../../../services/UserService";

export const useStatsPageController = () => {
  const [getAllGames, { data: allGames }] = ChessAPI.useLazyGetAllGamesQuery();

  const { userId } = useParams();

  useEffect(() => {
    getAllGames(userId ? Number(userId) : undefined);
  }, [userId]);

  const { data: statsData, isLoading: isStatsLoading } =
    UserAPI.useGetUserStatsQuery(userId ? Number(userId) : undefined, {
      refetchOnMountOrArgChange: true,
    });

  return {
    allGames,
    statsData,
    isStatsLoading,
    isUserById: !!userId,
  };
};
