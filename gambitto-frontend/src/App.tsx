import React from 'react';
import styles from './App.module.scss';
import { Route, RouteProps, Routes } from 'react-router';
import RoutesArray from './router/Routes';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage/LoginPage';

function App() {

  const userLogged = true;

  if (!userLogged) return (
    <div className={styles.appContainer}>
      <LoginPage />
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
