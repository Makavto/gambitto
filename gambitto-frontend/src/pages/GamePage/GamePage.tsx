import React, { useEffect, useState } from 'react'
import { ChessAPI } from '../../services/ChessService'
import { useAppSelector } from '../../hooks/redux';
import { useParams } from 'react-router';
import { IGameFullInfoDto } from '../../dtos/IGameFullInfoDto';
import { ChessWsServerMethodsEnum } from '../../models/enums/ChessWsMethodsEnum';
import ChessBoard from '../../components/ChessBoard/ChessBoard';

function GamePage() {

  const {gameId} = useParams();

  const [getGameInfo, {data: gameInfoData}] = ChessAPI.useLazyGetGameInfoQuery();
  const [getChessNotification, {data: chessListenerData}] = ChessAPI.useLazyChessNotificationsListenerQuery();
  const [makeMove, {data: makeMoveData}] = ChessAPI.useLazyMakeMoveQuery();

  const [chessGame, setChessGame] = useState<IGameFullInfoDto>();

  const {chessWsReady} = useAppSelector(state => state.wsSlice);

  const {user} = useAppSelector(state => state.userSlice);

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
      if (chessListenerData.method === ChessWsServerMethodsEnum.MadeMove && chessListenerData.data.gameFullInfo.id === Number(gameId)) {
        setChessGame(chessListenerData.data.gameFullInfo);
      }
    }
  }, [chessListenerData]);

  const onMakeMove = (moveCode: string) => {
    makeMove({gameId: Number(gameId), moveCode})
  }

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
      {
        !!chessGame && (chessGame.gameStatus === 'blackWin' ||
                        chessGame.gameStatus === 'whiteWin' ||
                        chessGame.gameStatus === 'stalemate' ||
                        chessGame.gameStatus === 'draw' ||
                        chessGame.gameStatus === 'inProgress') &&
          <ChessBoard
            startingFen={chessGame.gameMoves.length > 0 ? chessGame.gameMoves[chessGame.gameMoves.length - 1].positionBefore : undefined}
            lastMove={chessGame.gameMoves.length > 0 ? chessGame.gameMoves[chessGame.gameMoves.length - 1].moveCode : undefined}
            makeMove={onMakeMove}
            boardOrientation={chessGame.blackPlayerId === user?.id ? 'black' : 'white'}
          />
      }
    </div>
  )
}

export default GamePage