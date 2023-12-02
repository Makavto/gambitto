import React, { useEffect } from 'react'
import styles from './ProfilePage.module.scss';
import Card from '../../components/Card/Card'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import Button from '../../components/Button/Button';
import { AuthAPI } from '../../services/AuthService';
import { userSlice } from '../../store/reducers/userSlice';
import { ButtonTypesEnum } from '../../utils/ButtonTypesEnum';
import { ChessAPI } from '../../services/ChessService';
import ChessCard from '../../components/ChessCard/ChessCard';
import { useNavigate } from 'react-router-dom';
import { notificationsSlice } from '../../store/reducers/notificationsSlice';

function ProfilePage() {
  const {user} = useAppSelector(state => state.userSlice);
  const {setUser} = userSlice.actions;
  
  const navigate = useNavigate();

  const {chessWsReady: wsReady} = useAppSelector(state => state.wsSlice);

  const [acceptChess, {data: acceptChessData}] = ChessAPI.useLazyAcceptInvitationQuery();
  const [declineChess, {data: declineChessData}] = ChessAPI.useLazyDeclineInvitationQuery();

  const {deleteChessNotification} = notificationsSlice.actions;


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
                <ChessCard
                  game={game}
                  onAcceptGame={onAcceptChess}
                  onDeclineGame={onDeclineChess}
                  onEnterGame={onEnterChess}
                />
              </div>
            )))
          }
        </div>
      </div>
    </>
  )
}

export default ProfilePage