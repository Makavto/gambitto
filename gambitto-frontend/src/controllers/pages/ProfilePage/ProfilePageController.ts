import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/redux";
import { AuthAPI } from "../../../services/AuthService";
import { ChessAPI } from "../../../services/ChessService";
import { userSlice } from "../../../store/reducers/userSlice";
import { UserAPI } from "../../../services/UserService";
import { useNavigate, useParams } from "react-router";

export const useProfilePageController = () => {
  const { user } = useAppSelector((state) => state.userSlice);
  const { setUser } = userSlice.actions;

  const dispatch = useAppDispatch();

  const { userId } = useParams();
  const navigate = useNavigate();

  const [logoutUser] = AuthAPI.useLogoutUserMutation();

  const { data: allGames, isFetching: isGamesLoading } =
    ChessAPI.useGetAllGamesQuery(userId ? Number(userId) : undefined, {refetchOnMountOrArgChange: true});
  const [getMe, { isLoading: isMeLoading }] = UserAPI.useLazyGetMeQuery();
  const [getUserById, { data: userByIdData, isFetching: isUserLoading }] =
    UserAPI.useLazyGetUserByIdQuery();

  const onLogout = () => {
    logoutUser().then(() => {
      localStorage.removeItem("accessToken");
      dispatch(setUser(null));
      window.location.reload();
    });
  };

  const onViewUserStats = () => {
    if (userId) {
      navigate(`/community/${userId}/stats`);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserById(Number(userId));
    } else {
      getMe().then((res) => {
        if (res.data) {
          dispatch(setUser(res.data));
        }
      });
    }
  }, [userId]);

  return {
    user: userId ? userByIdData : user,
    isUserById: !!userId,
    allGames,
    onLogout,
    onViewUserStats,
    isGamesLoading,
    isUserLoading: isMeLoading || isUserLoading,
  };
};
