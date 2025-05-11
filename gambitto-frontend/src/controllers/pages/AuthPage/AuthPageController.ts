import { useEffect } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { AuthAPI } from "../../../services/AuthService";
import { ChessAPI } from "../../../services/ChessService";
import { FriendshipAPI } from "../../../services/FriendshipService";
import { userSlice } from "../../../store/reducers/userSlice";

export const useAuthPageController = () => {
  const [loginUser, { data: userData, error: userError }] =
    AuthAPI.useLoginUserMutation();

  const [registerUser, { data: registerData, error: registerError }] =
    AuthAPI.useRegisterUserMutation();

  const { setUser } = userSlice.actions;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!!userData) {
      dispatch(setUser(userData.user));
      localStorage.setItem("accessToken", userData.accessToken);
    }
    if (!!registerData) {
      dispatch(setUser(registerData.user));
      localStorage.setItem("accessToken", registerData.accessToken);
    }
  }, [userData, registerData]);

  return {
    loginUser,
    registerUser,
    userError,
    registerError,
  };
};
