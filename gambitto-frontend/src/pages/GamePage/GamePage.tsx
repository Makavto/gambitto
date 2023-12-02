import React, { useEffect, useState } from 'react'
import { ChessAPI } from '../../services/ChessService'
import { useAppSelector } from '../../hooks/redux';
import { useParams } from 'react-router';
import { IGameFullInfoDto } from '../../dtos/IGameFullInfoDto';
import { ChessWsServerMethodsEnum } from '../../models/enums/ChessWsMethodsEnum';
import ChessBoard from '../../components/ChessBoard/ChessBoard';
import styles from './GamePage.module.scss';

interface IHistoryMove {
  moveCode: string;
  positionBefore: string;
  number: number;
}

function GamePage() {

  const {gameId} = useParams();

  const [getGameInfo, {data: gameInfoData}] = ChessAPI.useLazyGetGameInfoQuery();
  const [getChessNotification, {data: chessListenerData}] = ChessAPI.useLazyChessNotificationsListenerQuery();
  const [makeMove, {data: makeMoveData}] = ChessAPI.useLazyMakeMoveQuery();

  const [chessGame, setChessGame] = useState<IGameFullInfoDto>();

  const {chessWsReady} = useAppSelector(state => state.wsSlice);

  const {user} = useAppSelector(state => state.userSlice);

  const [history, setHistory] = useState<IHistoryMove[][]>([]);
  const [activeMove, setActiveMove] = useState<IHistoryMove>();

  useEffect(() => {
    if (!!chessWsReady && !!gameId) {
      getGameInfo({gameId: Number(gameId)});
      getChessNotification();
    }
  }, [chessWsReady]);

  const resetHistory = (gameFullInfo: IGameFullInfoDto) => {
    let newHistoryArray: IHistoryMove[][] = [];
    const gameMoves = gameFullInfo.gameMoves;
    if (gameMoves.length === 0) return;
    for (let i = 0; i < gameMoves.length; i = i + 2) {
      if (!!gameMoves[i+1]) {
        newHistoryArray.push([
          {
            moveCode: gameMoves[i].moveCode,
            positionBefore: gameMoves[i].positionBefore,
            number: gameMoves[i].moveNumber
          },
          {
            moveCode: gameMoves[i+1].moveCode,
            positionBefore: gameMoves[i+1].positionBefore,
            number: gameMoves[i+1].moveNumber
          }
        ]);
      } else {
        newHistoryArray.push([
          {
            moveCode: gameMoves[i].moveCode,
            positionBefore: gameMoves[i].positionBefore,
            number: gameMoves[i].moveNumber
          }
        ]);
      }
    }
    setActiveMove(newHistoryArray[newHistoryArray.length - 1][newHistoryArray[newHistoryArray.length - 1].length - 1]);
    setHistory(newHistoryArray);
  }

  useEffect(() => {
    if (!!gameInfoData) {
      setChessGame(gameInfoData.gameFullInfo);
      resetHistory(gameInfoData.gameFullInfo);
    }
  }, [gameInfoData]);

  useEffect(() => {
    if (!!makeMoveData) {
      setChessGame(makeMoveData.gameFullInfo);
      resetHistory(makeMoveData.gameFullInfo)
    }
  }, [makeMoveData])

  useEffect(() => {
    if (!!chessListenerData) {
      if (chessListenerData.method === ChessWsServerMethodsEnum.Accepted && chessListenerData.data.game.id === Number(gameId)) {
        setChessGame((prev) => ({
          ...prev!,
          gameStatus: chessListenerData.data.game.gameStatus,
          gameStatusFormatted: chessListenerData.data.game.gameStatusFormatted
        }))
      }
      if (chessListenerData.method === ChessWsServerMethodsEnum.Declined && chessListenerData.data.game.id === Number(gameId)) {
        setChessGame((prev) => ({
          ...prev!,
          gameStatus: chessListenerData.data.game.gameStatus,
          gameStatusFormatted: chessListenerData.data.game.gameStatusFormatted
        }))
      }
      if (chessListenerData.method === ChessWsServerMethodsEnum.MadeMove && chessListenerData.data.gameFullInfo.id === Number(gameId)) {
        setChessGame(chessListenerData.data.gameFullInfo);
        resetHistory(chessListenerData.data.gameFullInfo);
      }
    }
  }, [chessListenerData]);

  const onMakeMove = (moveCode: string) => {
    makeMove({gameId: Number(gameId), moveCode});
  }

  const onMakeMoveActive = (newActiveMove: IHistoryMove) => {
    setActiveMove(newActiveMove);
  }

  return (
    <div className={styles.pageWrapper}>
      {
        !chessGame && <div>Загрузка...</div>
      }
      {
        !!chessGame && chessGame.gameStatus === 'invitation' && <div>Подождите, пока соперник войдёт в игру</div>
      }
      {
        !!chessGame && chessGame.gameStatus === 'declined' && <div>Соперник не захотел играть :(</div>
      }
      {
        !!chessGame && (chessGame.gameStatus === 'blackWin' ||
                        chessGame.gameStatus === 'whiteWin' ||
                        chessGame.gameStatus === 'stalemate' ||
                        chessGame.gameStatus === 'draw' ||
                        chessGame.gameStatus === 'inProgress') &&
          <div className={styles.gameBlock}>
            <div className={styles.boardWrapper}>
              <div className='textBig'>{user?.id === chessGame.blackPlayerId ? chessGame.whitePlayerName : chessGame.blackPlayerName}</div>
              <ChessBoard
                startingFen={chessGame.gameMoves.length > 0 ? chessGame.gameMoves[chessGame.gameMoves.length - 1].positionBefore : undefined}
                lastMove={chessGame.gameMoves.length > 0 ? chessGame.gameMoves[chessGame.gameMoves.length - 1].moveCode : undefined}
                makeMove={onMakeMove}
                boardOrientation={chessGame.blackPlayerId === user?.id ? 'black' : 'white'}
              />
              <div className={`textBig ${styles.user}`}>{user?.username}</div>
            </div>
            <div className={styles.statusWrapper}>
              <div>
                Статус партии: <span className='textBig'>{chessGame.gameStatusFormatted}</span>
              </div>
              <div className={styles.historyWrapper}>
                <div>История ходов:</div>
                <div>
                  {
                    history.map((movePair, i) => (
                      <div className={styles.historyItem} key={i}>
                        {i + 1}.&nbsp;
                        <button
                          onClick={() => onMakeMoveActive(movePair[0])}
                          className={`${styles.historyMove} ${movePair[0].number === activeMove?.number && styles.active}`}
                        >
                          {movePair[0].moveCode}
                        </button>&nbsp;
                        {
                          !!movePair[1] &&
                          <>
                          <button
                            onClick={() => onMakeMoveActive(movePair[1])}
                            className={`${styles.historyMove} ${movePair[1].number === activeMove?.number && styles.active}`}
                          >
                            {movePair[1].moveCode}
                          </button>&nbsp;
                          </>
                        }
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
      }
    </div>
  )
}

export default GamePage