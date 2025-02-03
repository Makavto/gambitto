import { useEffect } from "react";
import { AuthAPI, ChessAPI, FriendshipAPI } from "../../../services";
import { useAppDispatch } from "../../../hooks";
import { userSlice } from "../../../store";

export const useAuthPageController = () => {
  const [loginUser, { data: userData, error: userError }] =
    AuthAPI.useLoginUserMutation();

  const [registerUser, { data: registerData, error: registerError }] =
    AuthAPI.useRegisterUserMutation();

  const [createChessWs] = ChessAPI.useLazyCreateWsQuery();
  const [createFriendshipWs] = FriendshipAPI.useLazyCreateWsQuery();

  const { setUser } = userSlice.actions;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!!userData) {
      dispatch(setUser(userData.user));
      localStorage.setItem("accessToken", userData.accessToken);
      createChessWs();
      createFriendshipWs();
    }
    if (!!registerData) {
      dispatch(setUser(registerData.user));
      localStorage.setItem("accessToken", registerData.accessToken);
      createChessWs();
      createFriendshipWs();
    }
  }, [userData, registerData]);

  return {
    loginUser,
    registerUser,
    userError,
    registerError,
  };
};
