import React, { useEffect, useState } from 'react'
import { ChessAPI } from '../../services/ChessService'
import { useAppSelector } from '../../hooks/redux';
import { useParams } from 'react-router';
import { IGameFullInfoDto } from '../../dtos/IGameFullInfoDto';
import { ChessWsServerMethodsEnum } from '../../models/enums/ChessWsMethodsEnum';

function GamePage() {

  const {gameId} = useParams();

  const [getGameInfo, {data: gameInfoData}] = ChessAPI.useLazyGetGameInfoQuery();

  const [getChessNotification, {data: chessListenerData}] = ChessAPI.useLazyChessNotificationsListenerQuery();

  const [chessGame, setChessGame] = useState<IGameFullInfoDto>();

  const {chessWsReady} = useAppSelector(state => state.wsSlice);

  useEffect(() => {
    if (!!chessWsReady && !!gameId) {
      getGameInfo({gameId: Number(gameId)});
      getChessNotification();
    }
  }, [chessWsReady]);

  useEffect(() => {
    if (!!gameInfoData) {
      setChessGame(gameInfoData.gameFullInfo);
    }
  }, [gameInfoData]);

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
    }
  }, [chessListenerData])

  return (
    <div>
      {
        !chessGame && <div>Загрузка...</div>
      }
      {
        !!chessGame && chessGame.gameStatus === 'invitation' && <div>Подождите, пока соперник войдёт в игру</div>
      }
      {
        !!chessGame && chessGame.gameStatus === 'declined' && <div>Соперник не захотел играть :(</div>
      }
    </div>
  )
}

export default GamePage