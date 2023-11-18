import React, { useEffect, useState } from 'react'
import { AuthAPI } from '../../services/AuthService';
import { userSlice } from '../../store/reducers/userSlice';
import { useAppDispatch } from '../../hooks/redux';
import styles from './AuthPage.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

interface IAuthForm {
  email: string;
  password: string;
  username: string;
}

function AuthPage() {
  const [registrationPage, setRegistrationPage] = useState(false);

  const [loginUser, {data: userData, error: userError}] = AuthAPI.useLoginUserMutation();

  const [registerUser, {data: registerData, error: registerError}] = AuthAPI.useRegisterUserMutation();

  const {setUser} = userSlice.actions;

  const dispatch = useAppDispatch();

  const {register, handleSubmit, formState: {errors}} = useForm<IAuthForm>();

  const onSubmit: SubmitHandler<IAuthForm> = (data) => {
    if (registrationPage) {
      registerUser({
        email: data.email,
        password: data.password,
        username: data.username
      })
    } else {
      loginUser({
        email: data.email,
        password: data.password
      });
    }
  }

  const onSwitchRegister = () => {
    setRegistrationPage(!registrationPage);
  }

  useEffect(() => {
    if (!!userData) {
      dispatch(setUser(userData.user));
      localStorage.setItem('accessToken', userData.accessToken);
    }
    if (!!registerData) {
      dispatch(setUser(registerData.user));
      localStorage.setItem('accessToken', registerData.accessToken);
    }
  }, [userData, registerData]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authForm}>
        <div className={styles.title}>Добро пожаловать на Gambitto!</div>
        {
          registrationPage ?
            <div>
              Регистрация
            </div> :
            <div>
              Войдите в аккаунт
            </div>
        }
        <Input placeholder='e-mail' name='email' registerField={register} emptyMessage='Введите e-mail'/>
        {registrationPage && <Input placeholder='Логин' name='username' registerField={register} emptyMessage='Введите имя пользователя'/>}
        <Input placeholder='Пароль' name='password' registerField={register} emptyMessage='Введите пароль'/>
        {
          registrationPage ?
          <div>
            Уже есть аккаунт?
            <Button onClick={onSwitchRegister}>
              Войдите в него!
            </Button>
          </div> :
          <div>
            Нет аккаунта?
            <Button onClick={onSwitchRegister}>
              Создайте его!
            </Button>
          </div>
        }
        <div>
          <Button onClick={handleSubmit(onSubmit)}>
            {
              registrationPage ?
                <>Создать</> :
                <>Войти</>
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AuthPage