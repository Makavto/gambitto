import React, { useEffect } from 'react';
import styles from './UserSearchPage.module.scss';
import { UserAPI } from '../../services/UserService'
import { useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../../components/Input/Input';
import { useForm } from 'react-hook-form';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { ButtonTypesEnum } from '../../utils/ButtonTypesEnum';
import { FriendshipAPI } from '../../services/FriendshipService';
import { ChessAPI } from '../../services/ChessService';

interface IUserSearchPageProps {
  isForChessGame?: boolean
}

function UserSearchPage({isForChessGame}: IUserSearchPageProps) {

  const [getUsers, {data: usersData, isFetching: isUsersDataFetching}] = UserAPI.useLazyGetUsersQuery();

  const [sendFriendInvitation, {data: friendInvitationData}] = FriendshipAPI.useLazySendInvitationQuery();

  const [sendChessGameInvitation, {data: chessGameInvitationData}] = ChessAPI.useLazySendInvitationQuery();

  const [searchParams, setSearchParams] = useSearchParams();

  const {register} = useForm<{searchQuery: string}>();

  const navigate = useNavigate();

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
    sendFriendInvitation({inviteeId: id});
  }

  const onStartChessGame = (id: number) => {
    sendChessGameInvitation({inviteeId: id});
  }

  useEffect(() => {
    if (!!friendInvitationData) {
      getUsers({searchQuery: searchParams.get('searchQuery') ?? ''});
    }
  }, [friendInvitationData]);

  useEffect(() => {
    if (!!chessGameInvitationData) {
      navigate(`/chess/${chessGameInvitationData.game.id}`);
    }
  }, [chessGameInvitationData])

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
                  (!user.friendshipStatus || isForChessGame) &&
                  <div>
                    <Button onClick={() => isForChessGame ? onStartChessGame(user.id) : onAddFriend(user.id)} type={ButtonTypesEnum.Primary}>
                      {
                        isForChessGame ? 'Сыграть партию' : 'Добавить в друзья'
                      }
                    </Button>
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