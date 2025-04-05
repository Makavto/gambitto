import React, { useEffect, useState } from 'react';
import styles from './App.module.scss';
import { Route, RouteProps, Routes } from 'react-router';
import RoutesArray from './router/Routes';
import Layout from './components/Layout/Layout';
import AuthPage from './pages/AuthPage/AuthPage';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { UserAPI } from './services/UserService';
import { userSlice } from './store/reducers/userSlice';
import { ChessAPI } from './services/ChessService';
import { ChessWsServerMethodsEnum } from './models/enums/ChessWsMethodsEnum';
import { notificationsSlice } from './store/reducers/notificationsSlice';
import { FriendshipAPI } from './services/FriendshipService';
import { FriendshipWsServerMethodsEnum } from './models/enums/FriendshipWsMethodsEnum';
import { Loader } from './components/Loader/Loader';

function App() {
  const dispatch = useAppDispatch();

  const {user} = useAppSelector(state => state.userSlice);
  const {setUser} = userSlice.actions;

  const {chessWsReady, friendshipWsReady} = useAppSelector(state => state.wsSlice);

  const {addChessNotification, addFriendshipNotification, deleteChessNotification, deleteFriendshipNotification} = notificationsSlice.actions;

  const {data: getMeData, isLoading: isGetMeLoading} = UserAPI.useGetMeQuery();

  const [getChessNotification, {data: chessListenerData}] = ChessAPI.useLazyChessNotificationsListenerQuery();

  const [getFriendshipNotification, {data: friendshipNotificationData}] = FriendshipAPI.useLazyFriendshipNotificationsListenerQuery();

  const [userLogged, setUserLogged] = useState(false);

  useEffect(() => {
    if (!!user) {
      setUserLogged(true);
    } else {
      setUserLogged(false);
    }
  }, [user]);

  useEffect(() => {
    if (!!chessListenerData) {
      if (chessListenerData.method === ChessWsServerMethodsEnum.Invitation) {
        dispatch(addChessNotification(chessListenerData.data.game));
      }
      // if (chessListenerData.method === ChessWsServerMethodsEnum.Accepted || ChessWsServerMethodsEnum.Declined)
    }
  }, [chessListenerData]);

  useEffect(() => {
    if (!!friendshipNotificationData) {
      if (friendshipNotificationData.method === FriendshipWsServerMethodsEnum.Invitation) {
        dispatch(addFriendshipNotification(friendshipNotificationData.data.friendship));
      } else {
        dispatch(deleteFriendshipNotification(friendshipNotificationData.data.friendship));
      }
    }
  }, [friendshipNotificationData])

  useEffect(() => {
    if (chessWsReady) getChessNotification();
    if (friendshipWsReady) getFriendshipNotification();
  }, [chessWsReady, friendshipWsReady])

  useEffect(() => {
    if (!!getMeData) {
      dispatch(setUser(getMeData))
    }
  }, [getMeData])

  if (isGetMeLoading) return (
    <div className={styles.appContainer}>
      <Loader />
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
