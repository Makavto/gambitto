import React from 'react';
import styles from './ChessCard.module.scss';
import { IGameDto } from '../../dtos/IGameDto';
import Card from '../Card/Card';
import { useAppSelector } from '../../hooks/redux';
import Button from '../Button/Button';
import { ButtonTypesEnum } from '../../utils/ButtonTypesEnum';

interface IChessCard {
  game: IGameDto,
  onAcceptGame?: (id: number) => void;
  onDeclineGame?: (id: number) => void;
  onEnterGame?: (id: number) => void;
}

function ChessCard({game, onAcceptGame, onDeclineGame, onEnterGame}: IChessCard) {
  const {user} = useAppSelector(state => state.userSlice);

  return (
    <Card>
      <div className={styles.historyCardRow}>
        <div>
          Партия с <span className='textBold'>{game.blackPlayerId === user?.id ? game.whitePlayerName : game.blackPlayerName}</span>
        </div>
        <div>
          {
            game.gameStatus === 'invitation' && user?.id === game.inviteeId &&
            <>
            <span className={styles.button}>
              <Button onClick={() => onAcceptGame ? onAcceptGame(game.id) : {}} type={ButtonTypesEnum.Primary}>
                Принять заявку
              </Button>
            </span>
            <Button onClick={() => onDeclineGame ? onDeclineGame(game.id) : {}} type={ButtonTypesEnum.Danger}>
              Отклонить заявку
            </Button>
            </>
          }
          {
            (game.gameStatus === 'blackWin' ||
             game.gameStatus === 'whiteWin' ||
             game.gameStatus === 'stalemate' ||
             game.gameStatus === 'draw' ||
             game.gameStatus === 'invitation' && user?.id === game.senderId ||
             game.gameStatus === 'inProgress'
            ) &&
            <Button onClick={() => onEnterGame ? onEnterGame(game.id) : {}} type={ButtonTypesEnum.Primary}>
              Сесть за доску
            </Button>
          }
        </div>
      </div>
      <div className={styles.historyCardRow}>
        <div className={styles.historyCardItem}>
          Вы: за {game.blackPlayerId === user?.id ? 'чёрных' : 'белых'}
        </div>
        <div className={styles.historyCardItem}>
          {game.blackPlayerId === user?.id ? game.whitePlayerName : game.blackPlayerName}: за {game.blackPlayerId !== user?.id ? 'чёрных' : 'белых'}
        </div>
        <div className={`textSecondary ${styles.historyCardItem}`}>
        </div>
      </div>
      <div className={styles.historyCardRow}>
        <div>
          {game.gameStatusFormatted}
        </div>
        <div className={`textSecondary `}>
          Партия началась {new Date(game.createdAt).toLocaleDateString()} в {new Date(game.createdAt).getHours()}:{new Date(game.createdAt).getMinutes()}
        </div>
      </div>
    </Card>
  )
}

export default ChessCard