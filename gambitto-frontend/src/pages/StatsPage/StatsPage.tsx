import React, { useEffect } from 'react'
import { UserAPI } from '../../services/UserService'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './StatsPage.module.scss';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { ChessAPI } from '../../services/ChessService';
import {notificationsSlice} from '../../store/reducers/notificationsSlice';
import ChessCard from '../../components/ChessCard/ChessCard';
import Card from '../../components/Card/Card';

function StatsPage() {

  const navigate = useNavigate();

  const {chessWsReady: wsReady} = useAppSelector(state => state.wsSlice);

  const [acceptChess, {data: acceptChessData}] = ChessAPI.useLazyAcceptInvitationQuery();
  const [declineChess, {data: declineChessData}] = ChessAPI.useLazyDeclineInvitationQuery();

  const {deleteChessNotification} = notificationsSlice.actions;


  const dispatch = useAppDispatch();

  const [getAllGames, {data: allGames}] = ChessAPI.useLazyGetAllGamesQuery();

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

  const {userId} = useParams();

  const {data: statsData, isLoading: isStatsLoading} = UserAPI.useGetUserStatsQuery(userId ? Number(userId) : undefined);

  return (
    <div>
      <div className='textBig title'>Статистика</div>
      {isStatsLoading && <div>Загрузка...</div>}
      {
        statsData &&
        <div className={styles.cardWrapper}>
          <Card>
            <div className={styles.statsWrapper}>
              <div className={styles.statsItemsRow}>
                <div className={`${styles.statsItem} textBig`}>Игры</div>
                <div className={`${styles.statsItem} textBig`}>Серии</div>
              </div>
              <div className={styles.statsItemsRow}>
                <div className={styles.statsItem}>
                  <div className={styles.title}>Победы</div>
                  <div className={`${styles.stat} textSuccess`}>{statsData.wins}</div>
                </div>
                <div className={styles.statsItem}>
                  <div className={styles.title}>Победная серия</div>
                  <div className={`${styles.stat} textSuccess`}>{statsData.winStreak}</div>
                </div>
              </div>
              <div className={styles.statsItemsRow}>
                <div className={styles.statsItem}>
                  <div className={styles.title}>Поражения</div>
                  <div className={`${styles.stat} textAccent`}>{statsData.defeats}</div>
                </div>
                <div className={styles.statsItem}>
                  <div className={styles.title}>Серия поражений</div>
                  <div className={`${styles.stat} textAccent`}>{statsData.defeatStreak}</div>
                </div>
              </div>
              <div className={styles.statsItemsRow}>
                <div className={styles.statsItem}>
                  <div className={styles.title}>Вничью</div>
                  <div className={`${styles.stat} textSecondary`}>{statsData.draws}</div>
                </div>
                <div className={styles.statsItem}>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className={styles.statsItemsRow}>
                <div className={styles.statsItem}>
                  <div className={styles.title}>Всего</div>
                  <div className={styles.stat}>{statsData.totalGames}</div>
                </div>
                <div className={styles.statsItem}>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      }
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
  )
}

export default StatsPage