import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import Card from '../../components/Card/Card';
import UserCard from '../../components/UserCard/UserCard';
import { FriendshipAPI } from '../../services/FriendshipService';
import { notificationsSlice } from '../../store/reducers/notificationsSlice';
import styles from './NotificationPage.module.scss';
import ChessCard from '../../components/ChessCard/ChessCard';
import { ChessAPI } from '../../services/ChessService';
import { useNavigate } from 'react-router';

function NotificationsPage() {
  const {chessNotifications, friendshipNotifications} = useAppSelector(state => state.notificationsSlice);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [deleteFriend, {data: deleteFriendData}] = FriendshipAPI.useLazyDeleteFriendshipQuery();
  const [acceptFriend, {data: acceptFriendData}] = FriendshipAPI.useLazyAcceptInvitationQuery();
  const [declineFriend, {data: declineFriendData}] = FriendshipAPI.useLazyDeclineInvitationQuery();

  const [acceptChess, {data: acceptChessData}] = ChessAPI.useLazyAcceptInvitationQuery();
  const [declineChess, {data: declineChessData}] = ChessAPI.useLazyDeclineInvitationQuery();
  
  const {deleteFriendshipNotification, deleteChessNotification} = notificationsSlice.actions;

  const onDeleteFriend = (id: number) => {
    deleteFriend({invitationId: id});
  }

  const onDeclineFriend = (id: number) => {
    declineFriend({invitationId: id});
  }

  const onAcceptFriend = (id: number) => {
    acceptFriend({invitationId: id});
  }

  const onAcceptChess = (id: number) => {
    acceptChess({gameId: id})
  }

  const onDeclineChess = (id: number) => {
    declineChess({gameId: id});
  }

  const onEnterChess = (id: number) => {
    navigate(`/chess/${id}`);
  }

  useEffect(() => {
    if (!!deleteFriendData) {
      dispatch(deleteFriendshipNotification(deleteFriendData.friendship))
    }
  }, [deleteFriendData])

  useEffect(() => {
    if (!!declineFriendData) {
      dispatch(deleteFriendshipNotification(declineFriendData.friendship))
    }
  }, [declineFriendData])

  useEffect(() => {
    if (!!acceptFriendData) {
      dispatch(deleteFriendshipNotification(acceptFriendData.friendship))
    }
  }, [acceptFriendData])

  useEffect(() => {
    if (!!acceptChessData) {
      dispatch(deleteChessNotification(acceptChessData.game));
      navigate(`/chess/${acceptChessData.game.id}`)
    }
  }, [acceptChessData])

  useEffect(() => {
    if (!!declineChessData) {
      dispatch(deleteChessNotification(declineChessData.game))
    }
  }, [declineChessData])

  return (
    <div>
      <div className={`textBig ${styles.title}`}>Заявки в друзья</div>
      <div>
        {
          friendshipNotifications.length === 0 && <div className='textSecondary'>Нет новых заявок</div>
        }
        {
          friendshipNotifications.length > 0 && friendshipNotifications.map((friendship, i) => (
            <div className={styles.card} key={i}>
              <UserCard
                friendship={friendship}
                onAcceptFriend={onAcceptFriend}
                onDeclineFriend={onDeclineFriend}
                onDeleteFriend={onDeleteFriend}
              />
            </div>
          ))
        }
      </div>
      <div className={`textBig ${styles.title}`}>Приглашения на игру в шахматы</div>
      <div>
        {
          chessNotifications.length === 0 && <div className='textSecondary'>Нет новых приглашений</div>
        }
        {
          chessNotifications.length > 0 && chessNotifications.map((chess, i) => (
            <div className={styles.card} key={i}>
              <ChessCard
                game={chess}
                onAcceptGame={onAcceptChess}
                onDeclineGame={onDeclineChess}
                onEnterGame={onEnterChess}
              />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default NotificationsPage