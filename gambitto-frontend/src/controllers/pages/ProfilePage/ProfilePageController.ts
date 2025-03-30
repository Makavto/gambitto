import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/redux";
import { AuthAPI } from "../../../services/AuthService";
import { ChessAPI } from "../../../services/ChessService";
import { userSlice } from "../../../store/reducers/userSlice";
import { UserAPI } from "../../../services/UserService";

export const useProfilePageController = () => {
  const { user } = useAppSelector((state) => state.userSlice);
  const { setUser } = userSlice.actions;

  const { chessWsReady: wsReady } = useAppSelector((state) => state.wsSlice);

  const dispatch = useAppDispatch();

  const [logoutUser] = AuthAPI.useLogoutUserMutation();

  const [getAllGames, { data: allGames }] = ChessAPI.useLazyGetAllGamesQuery();
  const [getMe] = UserAPI.useLazyGetMeQuery();

  const onLogout = () => {
    logoutUser().then(() => {
      localStorage.removeItem("accessToken");
      dispatch(setUser(null));
    });
  };

  useEffect(() => {
    if (wsReady) {
      getAllGames();
    }
  }, [wsReady]);

  useEffect(() => {
    getMe().then((res) => {
      if (res.data) {
        dispatch(setUser(res.data));
      }
    });
  }, []);

  return {
    user,
    allGames,
    onLogout,
  };
};
