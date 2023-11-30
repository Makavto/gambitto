import React, { useEffect } from 'react'
import { useAppSelector } from '../../hooks/redux'
import { FriendshipAPI } from '../../services/FriendshipService';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import styles from './CommunityPage.module.scss';
import { ButtonTypesEnum } from '../../utils/ButtonTypesEnum';
import { UserAPI } from '../../services/UserService';
import { useNavigate } from 'react-router';

function CommunityPage() {
  const {user} = useAppSelector(state => state.userSlice);
  const {friendshipWsReady} = useAppSelector(state => state.wsSlice);

  const [getAllFriends, {data: allFriendsData}] = FriendshipAPI.useLazyGetAllFriendsQuery();
  const [getTop, {data: topData, isLoading: isTopLoading}] = UserAPI.useLazyGetTopQuery();

  const [deleteFriend, {data: deleteFriendData}] = FriendshipAPI.useLazyDeleteFriendshipQuery();

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
    deleteFriend({invitationId: id}).then((res) => getAllFriends());
  }

  return (
    <div className={styles.pageWrapper}>
      <div>
        <div className={`textBig ${styles.row}`}>Список лидеров</div>
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
        <div className={`textBig`}>Друзья</div>
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
                <Card>
                  <div className={styles.friendshipCardRow}>
                    <div>
                      {user?.id === friendship.inviteeId ? friendship.senderName : friendship.inviteeName}
                    </div>
                    <div>
                      <Button onClick={() => onDeleteFriend(friendship.id)} type={ButtonTypesEnum.Danger}>
                        Удалить друга
                      </Button>
                    </div>
                  </div>
                  <div className={styles.friendshipCardRow}>
                    <div>
                      {friendship.friendshipStatusFormatted}
                    </div>
                    <div>
                      {new Date(friendship.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              </div>
            )))
        }
      </div>
    </div>
  )
}

export default CommunityPage