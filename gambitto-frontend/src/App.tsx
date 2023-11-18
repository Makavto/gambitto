import React, { useEffect, useState } from 'react';
import styles from './App.module.scss';
import { Route, RouteProps, Routes } from 'react-router';
import RoutesArray from './router/Routes';
import Layout from './components/Layout/Layout';
import AuthPage from './pages/AuthPage/AuthPage';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { UserAPI } from './services/UserService';
import { userSlice } from './store/reducers/userSlice';

function App() {
  const dispatch = useAppDispatch();

  const {user} = useAppSelector(state => state.userSlice);
  const {setUser} = userSlice.actions;

  const {data: getMeData, isLoading: isGetMeLoading} = UserAPI.useGetMeQuery();

  const [userLogged, setUserLogged] = useState(false);

  useEffect(() => {
    if (!!user) {
      setUserLogged(true);
    } else {
      setUserLogged(false);
    }
  }, [user]);

  useEffect(() => {
    if (!!getMeData) {
      dispatch(setUser(getMeData))
    }
  }, [getMeData])

  if (isGetMeLoading) return (
    <div className={styles.appContainer}>
      Загрузка
    </div>
  )

  if (!userLogged) return (
    <div className={styles.appContainer}>
      <AuthPage />
    </div>
  )
  return (
    <div className={styles.appContainer}>
    <Layout>
      <Routes>
        {
          RoutesArray.map((routeProps: RouteProps, index: number) => (
            <Route {...routeProps} key={index} />
          ))
        }
      </Routes>
    </Layout>
    </div>
  );
}

export default App;
