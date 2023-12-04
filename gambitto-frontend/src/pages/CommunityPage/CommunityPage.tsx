import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { FriendshipAPI } from '../../services/FriendshipService';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import styles from './CommunityPage.module.scss';
import { ButtonTypesEnum } from '../../utils/ButtonTypesEnum';
import { UserAPI } from '../../services/UserService';
import { useNavigate } from 'react-router';
import { notificationsSlice } from '../../store/reducers/notificationsSlice';
import UserCard from '../../components/UserCard/UserCard';

function CommunityPage() {
  const dispatch = useAppDispatch();

  const {friendshipWsReady} = useAppSelector(state => state.wsSlice);

  const {deleteFriendshipNotification} = notificationsSlice.actions;

  const [getAllFriends, {data: allFriendsData}] = FriendshipAPI.useLazyGetAllFriendsQuery();
  const [getTop, {data: topData, isLoading: isTopLoading}] = UserAPI.useLazyGetTopQuery();

  const [deleteFriend, {data: deleteFriendData}] = FriendshipAPI.useLazyDeleteFriendshipQuery();
  const [acceptFriend, {data: acceptFriendData}] = FriendshipAPI.useLazyAcceptInvitationQuery();
  const [declineFriend, {data: declineFriendData}] = FriendshipAPI.useLazyDeclineInvitationQuery();

  useEffect(() => {
    if (friendshipWsReady) {
      getAllFriends();
      getTop();
    }
  }, [friendshipWsReady]);

  const navigate = useNavigate();

  const onAddFriend = () => {
    navigate('/community/add');
  }

  const onDeleteFriend = (id: number) => {
    deleteFriend({invitationId: id});
  }

  const onDeclineFriend = (id: number) => {
    declineFriend({invitationId: id});
  }

  const onAcceptFriend = (id: number) => {
    acceptFriend({invitationId: id});
  }

  useEffect(() => {
    if (!!deleteFriendData || !!acceptFriendData || !!declineFriendData) {
      getAllFriends();
    }
  }, [deleteFriendData, acceptFriendData, declineFriendData]);

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

  return (
    <div className={styles.pageWrapper}>
      <div>
        <div className={`textBig ${styles.row} title`}>Список лидеров</div>
      </div>
      {
        isTopLoading && <div>Загрузка...</div>
      }
      {
        topData &&
        <table className={styles.table}>
          <thead>
            <tr>
              <th><h1>Имя пользователя</h1></th>
              <th><h1>Количество побед</h1></th>
              <th><h1>Количество игр</h1></th>
            </tr>
          </thead>
          <tbody>
            {
              topData.map((user, i) => (
                <tr key={i}>
                  <td>
                    {user.username}
                  </td>
                  <td>
                    {user.wins}
                  </td>
                  <td>
                    {user.totalGames}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      }
      <div className={styles.row}>
        <div className={`textBig title`}>Друзья</div>
        <Button type={ButtonTypesEnum.Primary} onClick={onAddFriend}>Добавить друга</Button>
      </div>
      <div>
        {
          !allFriendsData && <div>Загрузка...</div>
        }
        {
          allFriendsData &&
          (allFriendsData.friendships.length === 0 ?
            <div>Список друзей пуст. Самое время подружиться!</div> :
            allFriendsData.friendships.map((friendship, i) => (
              <div className={styles.friendshipCardWrapper} key={i}>
                <UserCard
                  friendship={friendship}
                  onAcceptFriend={onAcceptFriend}
                  onDeclineFriend={onDeclineFriend}
                  onDeleteFriend={onDeleteFriend}
                />
              </div>
            )))
        }
      </div>
    </div>
  )
}

export default CommunityPage