import React, { useEffect } from 'react';
import styles from './UserSearchPage.module.scss';
import { UserAPI } from '../../services/UserService'
import { useSearchParams } from 'react-router-dom';
import Input from '../../components/Input/Input';
import { useForm } from 'react-hook-form';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { ButtonTypesEnum } from '../../utils/ButtonTypesEnum';
import { FriendshipAPI } from '../../services/FriendshipService';

function UserSearchPage() {

  const [getUsers, {data: usersData, isFetching: isUsersDataFetching}] = UserAPI.useLazyGetUsersQuery();

  const [sendFriendInvitation, {data: friendInvitationData}] = FriendshipAPI.useLazySendInvitationQuery();

  const [searchParams, setSearchParams] = useSearchParams();

  const {register} = useForm<{searchQuery: string}>();

  useEffect(() => {
    getUsers({searchQuery: searchParams.get('searchQuery') ?? ''})
  }, [searchParams.get('searchQuery')]);

  let inputDelay: NodeJS.Timeout;

  const onSearch = (value: string) => {
    clearTimeout(inputDelay);
    inputDelay = setTimeout(function() {
        setSearchParams({searchQuery: value});
    }, 500);
  }

  const onAddFriend = (id: number) => {
    sendFriendInvitation({inviteeId: id}).then((res) => {
      getUsers({searchQuery: searchParams.get('searchQuery') ?? ''})
    })
  }

  useEffect(() => {
    console.log(friendInvitationData)
  }, [friendInvitationData])

  return (
    <div className={styles.pageWrapper}>
      <div className={`textBig ${styles.title}`}>Поиск пользователей</div>
      <div className={styles.searchWrapper}>
        <Input name='searchQuery' registerField={register} placeholder='Найти пользователя' onChange={onSearch}/>
      </div>
      {
        isUsersDataFetching && <div>Загрузка...</div>
      }
      {
        usersData?.length === 0 && <div className='textSecondary'>Пользователей не найдено</div>
      }
      {
        usersData &&
        usersData.map((user, i) => (
          <div className={styles.cardWrapper} key={i}>
            <Card>
              <div className={styles.cardRow}>
                <div className={`textBold`}>{user.username}</div>
                {
                  !user.friendshipStatus &&
                  <div>
                    <Button onClick={() => onAddFriend(user.id)} type={ButtonTypesEnum.Primary}>Добавить в друзья</Button>
                  </div>
                }
              </div>
              <div className={styles.cardRow}>
                <div className={styles.cardItem}>
                  {user.friendshipStatusFromatted ?? 'Не в друзьях'}
                </div>
                <div className={styles.cardItem}>
                  Побед: {user.wins}
                </div>
                <div className={styles.cardItem}>
                  Всего игр: {user.totalGames}
                </div>
              </div>
            </Card>
          </div>
        ))
      }
    </div>
  )
}

export default UserSearchPage