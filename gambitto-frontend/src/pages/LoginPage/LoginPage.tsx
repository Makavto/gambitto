import React, { useEffect } from 'react'
import { AuthAPI } from '../../services/AuthService';
import { userSlice } from '../../store/reducers/userSlice';
import { useAppDispatch } from '../../hooks/redux';

function LoginPage() {
  const [login, {data: userData, error: userError}] = AuthAPI.useLoginUserMutation();

  const {setUser} = userSlice.actions;

  const dispatch = useAppDispatch();

  const onClick =() => {
    login({
      email: "user2@mail.ru",
      password: "test"
    })
  }

  useEffect(() => {
    if (!!userData) {
      dispatch(setUser(userData.user));
      localStorage.setItem('accessToken', userData.accessToken)
    }
  }, [userData]);

  return (
    <div>
      <button onClick={onClick}>login</button>
    </div>
  )
}

export default LoginPage