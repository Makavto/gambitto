import { useEffect } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { AuthAPI } from "../../../services/AuthService";
import { userSlice } from "../../../store/reducers/userSlice";

// Контроллер страницы авторизации
// Управляет процессом входа и регистрации пользователей
export const useAuthPageController = () => {
  // Хук для авторизации пользователя
  const [loginUser, { data: userData, error: userError }] =
    AuthAPI.useLoginUserMutation();

  // Хук для регистрации нового пользователя
  const [registerUser, { data: registerData, error: registerError }] =
    AuthAPI.useRegisterUserMutation();

  // Получение action для установки данных пользователя в store
  const { setUser } = userSlice.actions;

  const dispatch = useAppDispatch();

  // Эффект для обработки успешной авторизации или регистрации
  // Сохраняет токен доступа в localStorage и обновляет данные пользователя в store
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
