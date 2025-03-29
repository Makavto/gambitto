import { useParams } from "react-router";
import { UserAPI } from "../../../services/UserService";

export const useRatingsHistoryGraphController = () => {
  const { userId } = useParams();

  const { data: statsData, isLoading: isStatsLoading } =
    UserAPI.useGetUserStatsQuery(userId ? Number(userId) : undefined);

  return {
    graphData: statsData?.ratingsHistory,
  };
};
