import React from 'react';
import './App.css';
import { Route, RouteProps, Routes } from 'react-router';
import RoutesArray from './router/Routes';

function App() {
  return (
    <Routes>
      {
        RoutesArray.map((routeProps: RouteProps, index: number) => (
          <Route {...routeProps} key={index} />
        ))
      }
      adsdasdasd
    </Routes>
  );
}

export default App;
