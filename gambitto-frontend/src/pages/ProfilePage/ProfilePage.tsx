import React, { useEffect } from 'react'
import styles from './ProfilePage.module.scss';
import Card from '../../components/Card/Card'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import Button from '../../components/Button/Button';
import { AuthAPI } from '../../services/AuthService';
import { userSlice } from '../../store/reducers/userSlice';
import { ButtonTypesEnum } from '../../utils/ButtonTypesEnum';
import { ChessAPI } from '../../services/ChessService';

function ProfilePage() {
  const {user} = useAppSelector(state => state.userSlice);
  const {setUser} = userSlice.actions;

  const {chessWsReady: wsReady} = useAppSelector(state => state.wsSlice);


  const dispatch = useAppDispatch();

  const [logoutUser] = AuthAPI.useLogoutUserMutation();

  const [getAllGames, {data: allGames}] = ChessAPI.useLazyGetAllGamesQuery();

  const onLogout = () => {
    logoutUser().then(() => {
      localStorage.removeItem('accessToken');
      dispatch(setUser(null));
    });
  }

  useEffect(() => {
    if (wsReady) {
      getAllGames();
    }
  }, [wsReady])

  return (
    <>
      <div className={styles.pageWrapper}>
        <div className={styles.cardWrapper}>
          <Card light={true}>
            {
              user &&
              <div className={styles.cardContainer}>
                <div className={styles.cardItem}>
                  <span className='textBig'>Имя пользователя: <span className='textBold'>{user.username}</span></span>
                  <div>
                    <Button type={ButtonTypesEnum.Danger} onClick={onLogout}>Выйти</Button>
                  </div>
                </div>
                <div className={styles.cardItem}>
                  <span className="textSecondary">E-mail: {user.email}</span>
                </div>
                <div>
                  <span className="textSecondary">Шахматист с {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            }
          </Card>
        </div>
        <div className='textBig title'>
          История партий
        </div>
        <div className={styles.historyWrapper}>
          {
            !allGames && <div>Загрузка...</div>
          }
          {
            allGames &&
            (allGames.games.length === 0 ?
            <div>Не сыграно ни одной партии</div> :
            allGames.games.map((game, i) => (
              <div className={styles.historyCardWrapper} key={i}>
                <Card>
                  <div className={styles.historyCardRow}>
                    <div>
                      Партия с <span className='textBold'>{game.blackPlayerId === user?.id ? game.whitePlayerName : game.blackPlayerName}</span>
                    </div>
                    <div className='textBold'>
                      {game.gameStatusFormatted}
                    </div>
                  </div>
                  <div className={styles.historyCardRow}>
                    <div>
                      Вы: за {game.blackPlayerId === user?.id ? 'чёрных' : 'белых'}
                    </div>
                    <div>
                      {game.blackPlayerId === user?.id ? game.whitePlayerName : game.blackPlayerName}: за {game.blackPlayerId !== user?.id ? 'чёрных' : 'белых'}
                    </div>
                    <div className='textSecondary'>
                      Партия началась {new Date(game.createdAt).toLocaleDateString()} в {new Date(game.createdAt).getHours()}:{new Date(game.createdAt).getMinutes()}
                    </div>
                  </div>
                </Card>
              </div>
            )))
          }
        </div>
      </div>
    </>
  )
}

export default ProfilePage