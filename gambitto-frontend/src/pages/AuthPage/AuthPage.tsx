import React, { useEffect, useState } from 'react'
import { AuthAPI } from '../../services/AuthService';
import { userSlice } from '../../store/reducers/userSlice';
import { useAppDispatch } from '../../hooks/redux';
import styles from './AuthPage.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { isFetchBaseQueryErrorType } from '../../utils/fetchBaseQueryErrorCheck';
import { ButtonTypesEnum } from '../../utils/ButtonTypesEnum';

interface IAuthForm {
  email: string;
  password: string;
  username: string;
}

function AuthPage() {
  const [registrationPage, setRegistrationPage] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [loginUser, {data: userData, error: userError}] = AuthAPI.useLoginUserMutation();

  const [registerUser, {data: registerData, error: registerError}] = AuthAPI.useRegisterUserMutation();

  const {setUser} = userSlice.actions;

  const dispatch = useAppDispatch();

  const {register, handleSubmit} = useForm<IAuthForm>();

  const onSubmit: SubmitHandler<IAuthForm> = (data) => {
    setErrorMessage(null);
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
    setErrorMessage(null);
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

  useEffect(() => {
    if (!!userError && isFetchBaseQueryErrorType(userError)) {
      setErrorMessage(userError.data.message)
    }
  }, [userError])

  useEffect(() => {
    if (!!registerError && isFetchBaseQueryErrorType(registerError)) {
      setErrorMessage(registerError.data.message)
    }
  }, [registerError])

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authForm}>
        <div className={styles.title}>Добро пожаловать на Gambitto!</div>
        {
          registrationPage ?
            <div className={styles.subTitle}>
              Регистрация
            </div> :
            <div className={styles.subTitle}>
              Войдите в аккаунт
            </div>
        }
        <div className={styles.authInput}>
          <Input placeholder='E-mail' name='email' registerField={register} emptyMessage='Введите e-mail'/>
        </div>
        {registrationPage &&
          <div className={styles.authInput}>
            <Input placeholder='Логин' name='username' registerField={register} emptyMessage='Введите имя пользователя'/>
          </div>
        }
        <div className={styles.authInput}>
          <Input isPassword={true} placeholder='Пароль' name='password' registerField={register} emptyMessage='Введите пароль'/>
        </div>
        {
          errorMessage &&
            <div className={styles.error}>{errorMessage}</div>
        }
        <div className={styles.account}>
          {
            registrationPage ?
            <>
              <span>Уже есть аккаунт? </span>
              <Button type={ButtonTypesEnum.Link} onClick={onSwitchRegister}>
                Войдите в него!
              </Button>
            </> :
            <>
              <span>Нет аккаунта? </span>
              <Button type={ButtonTypesEnum.Link} onClick={onSwitchRegister}>
                Создайте его!
              </Button>
            </>
          }
        </div>
        <div>
          <Button type={ButtonTypesEnum.Primary} onClick={handleSubmit(onSubmit)}>
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