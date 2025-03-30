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

  const { chessWsReady: wsReady } = useAppSelector((state) => state.wsSlice);

  const dispatch = useAppDispatch();

  const { userId } = useParams();
  const navigate = useNavigate();

  const [logoutUser] = AuthAPI.useLogoutUserMutation();

  const [getAllGames, { data: allGames }] = ChessAPI.useLazyGetAllGamesQuery();
  const [getMe] = UserAPI.useLazyGetMeQuery();
  const [getUserById, { data: userByIdData }] =
    UserAPI.useLazyGetUserByIdQuery();

  const onLogout = () => {
    logoutUser().then(() => {
      localStorage.removeItem("accessToken");
      dispatch(setUser(null));
    });
  };

  const onViewUserStats = () => {
    if (userId) {
      navigate(`/community/${userId}/stats`);
    }
  };

  useEffect(() => {
    if (wsReady) {
      getAllGames(userId ? Number(userId) : undefined);
    }
  }, [wsReady, userId]);

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
  };
};
