import React, { useEffect, useState } from "react";
import styles from "./AuthPage.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import { useAuthPageController } from "../../controllers/pages/AuthPage/AuthPageController";
import { ButtonTypesEnum } from "../../utils/ButtonTypesEnum";
import { isFetchBaseQueryErrorType } from "../../utils/fetchBaseQueryErrorCheck";

interface IAuthForm {
  email: string;
  password: string;
  username: string;
}

function AuthPage() {
  const [registrationPage, setRegistrationPage] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { loginUser, registerError, registerUser, userError } =
    useAuthPageController();

  const { register, handleSubmit } = useForm<IAuthForm>();

  const onSubmit: SubmitHandler<IAuthForm> = (data) => {
    setErrorMessage(null);
    if (registrationPage) {
      registerUser({
        email: data.email,
        password: data.password,
        username: data.username,
      });
    } else {
      loginUser({
        email: data.email,
        password: data.password,
      });
    }
  };

  const onSwitchRegister = () => {
    setErrorMessage(null);
    setRegistrationPage(!registrationPage);
  };

  useEffect(() => {
    if (!!userError && isFetchBaseQueryErrorType(userError)) {
      setErrorMessage(userError.data.message);
    }
  }, [userError]);

  useEffect(() => {
    if (!!registerError && isFetchBaseQueryErrorType(registerError)) {
      setErrorMessage(registerError.data.message);
    }
  }, [registerError]);

  return (
    <div className={styles.pageWrapper}>
      <Card>
        <div className={styles.authForm}>
          <div className={styles.title}>Добро пожаловать на Gambitto!</div>
          {registrationPage ? (
            <div className={styles.subTitle}>Регистрация</div>
          ) : (
            <div className={styles.subTitle}>Войдите в аккаунт</div>
          )}
          <div className={styles.authInput}>
            <Input
              placeholder="E-mail"
              name="email"
              registerField={register}
              emptyMessage="Введите e-mail"
            />
          </div>
          {registrationPage && (
            <div className={styles.authInput}>
              <Input
                placeholder="Логин"
                name="username"
                registerField={register}
                emptyMessage="Введите имя пользователя"
              />
            </div>
          )}
          <div className={styles.authInput}>
            <Input
              isPassword={true}
              placeholder="Пароль"
              name="password"
              registerField={register}
              emptyMessage="Введите пароль"
            />
          </div>
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}
          <div className={styles.account}>
            {registrationPage ? (
              <>
                <span>Уже есть аккаунт? </span>
                <Button type={ButtonTypesEnum.Link} onClick={onSwitchRegister}>
                  Войдите в него!
                </Button>
              </>
            ) : (
              <>
                <span>Нет аккаунта? </span>
                <Button type={ButtonTypesEnum.Link} onClick={onSwitchRegister}>
                  Создайте его!
                </Button>
              </>
            )}
          </div>
          <div>
            <Button
              type={ButtonTypesEnum.Primary}
              onClick={handleSubmit(onSubmit)}
            >
              {registrationPage ? <>Создать</> : <>Войти</>}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AuthPage;
