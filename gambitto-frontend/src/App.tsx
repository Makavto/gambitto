import React from 'react';
import styles from './App.module.scss';
import { Route, RouteProps, Routes } from 'react-router';
import RoutesArray from './router/Routes';

function App() {
  return (
    <>
    <Routes>
      {
        RoutesArray.map((routeProps: RouteProps, index: number) => (
          <Route {...routeProps} key={index} />
        ))
      }
    </Routes>
    <div className={styles.footer}>footer</div>
    </>
  );
}

export default App;
