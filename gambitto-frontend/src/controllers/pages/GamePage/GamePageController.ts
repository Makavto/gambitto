import { Chess } from "chess.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { IGameFullInfoDto } from "../../../dtos/IGameFullInfoDto";
import { useAppSelector } from "../../../hooks/redux";
import { ChessWsServerMethodsEnum } from "../../../models/enums/ChessWsMethodsEnum";
import { ChessAPI } from "../../../services/ChessService";
import { UserAPI } from "../../../services/UserService";

interface IHistoryMove {
  moveCode: string;
  positionBefore: string;
  number: number;
}

export const useGamePageController = () => {
  const { gameId, userId } = useParams();

  const [getGameInfo, { data: gameInfoData }] =
    ChessAPI.useLazyGetGameInfoQuery();
  const [getChessNotification, { data: chessListenerData }] =
    ChessAPI.useLazyChessNotificationsListenerQuery();
  const [makeMove, { data: makeMoveData }] = ChessAPI.useLazyMakeMoveQuery();
  const [resign, { data: resignData }] = ChessAPI.useLazyResignQuery();
  const [getOpponent, { data: opponentData }] =
    UserAPI.useLazyGetUserByIdQuery();

  const [getUser, { data: userData }] = UserAPI.useLazyGetUserByIdQuery();

  const [chessGame, setChessGame] = useState<IGameFullInfoDto>();

  const { chessWsReady } = useAppSelector((state) => state.wsSlice);

  const { user } = useAppSelector((state) => state.userSlice);

  const [history, setHistory] = useState<IHistoryMove[][]>([]);
  const [activeMove, setActiveMove] = useState<IHistoryMove>();

  useEffect(() => {
    if (!!chessWsReady && !!gameId) {
      getGameInfo({ gameId: Number(gameId) });
      getChessNotification();
    }
  }, [chessWsReady]);

  useEffect(() => {
    if (userId) {
      getUser(Number(userId));
    }
  }, [userId]);

  const resetHistory = (gameFullInfo: IGameFullInfoDto) => {
    let newHistoryArray: IHistoryMove[][] = [];
    const gameMoves = gameFullInfo.gameMoves;
    if (gameMoves.length === 0) return;
    for (let i = 0; i < gameMoves.length; i = i + 2) {
      if (!!gameMoves[i + 1]) {
        newHistoryArray.push([
          {
            moveCode: gameMoves[i].moveCode,
            positionBefore: gameMoves[i].positionBefore,
            number: gameMoves[i].moveNumber,
          },
          {
            moveCode: gameMoves[i + 1].moveCode,
            positionBefore: gameMoves[i + 1].positionBefore,
            number: gameMoves[i + 1].moveNumber,
          },
        ]);
      } else {
        newHistoryArray.push([
          {
            moveCode: gameMoves[i].moveCode,
            positionBefore: gameMoves[i].positionBefore,
            number: gameMoves[i].moveNumber,
          },
        ]);
      }
    }
    setActiveMove(
      newHistoryArray[newHistoryArray.length - 1][
        newHistoryArray[newHistoryArray.length - 1].length - 1
      ]
    );
    setHistory(newHistoryArray);
  };

  useEffect(() => {
    if (!!gameInfoData) {
      setChessGame(gameInfoData.gameFullInfo);
      resetHistory(gameInfoData.gameFullInfo);
      if (userId) {
        getOpponent(
          gameInfoData.gameFullInfo.whitePlayerId === Number(userId)
            ? gameInfoData.gameFullInfo.blackPlayerId
            : gameInfoData.gameFullInfo.whitePlayerId
        );
      } else if (user) {
        getOpponent(
          gameInfoData.gameFullInfo.whitePlayerId === user.id
            ? gameInfoData.gameFullInfo.blackPlayerId
            : gameInfoData.gameFullInfo.whitePlayerId
        );
      }
    }
  }, [gameInfoData, userId]);

  useEffect(() => {
    if (!!makeMoveData) {
      setChessGame(makeMoveData.gameFullInfo);
      resetHistory(makeMoveData.gameFullInfo);
    }
  }, [makeMoveData]);

  useEffect(() => {
    if (!!resignData) {
      setChessGame(resignData.gameFullInfo);
    }
  }, [resignData]);

  useEffect(() => {
    if (!!chessListenerData) {
      if (
        chessListenerData.method === ChessWsServerMethodsEnum.Accepted &&
        chessListenerData.data.game.id === Number(gameId)
      ) {
        setChessGame((prev) => ({
          ...prev!,
          gameStatus: chessListenerData.data.game.gameStatus,
          gameStatusFormatted: chessListenerData.data.game.gameStatusFormatted,
        }));
      }
      if (
        chessListenerData.method === ChessWsServerMethodsEnum.Declined &&
        chessListenerData.data.game.id === Number(gameId)
      ) {
        setChessGame((prev) => ({
          ...prev!,
          gameStatus: chessListenerData.data.game.gameStatus,
          gameStatusFormatted: chessListenerData.data.game.gameStatusFormatted,
        }));
      }
      if (
        chessListenerData.method === ChessWsServerMethodsEnum.MadeMove &&
        chessListenerData.data.gameFullInfo.id === Number(gameId)
      ) {
        setChessGame(chessListenerData.data.gameFullInfo);
        resetHistory(chessListenerData.data.gameFullInfo);
      }
      if (
        chessListenerData.method === ChessWsServerMethodsEnum.Resigned &&
        chessListenerData.data.gameFullInfo.id === Number(gameId)
      ) {
        setChessGame(chessListenerData.data.gameFullInfo);
      }
    }
  }, [chessListenerData]);

  const onMakeMove = (moveCode: string) => {
    makeMove({ gameId: Number(gameId), moveCode });
  };

  const onResign = () => {
    resign({ gameId: Number(gameId) });
  };

  const onMakeMoveActive = (newActiveMove: IHistoryMove) => {
    setActiveMove(newActiveMove);
  };

  const getPositionAfterMove = (positionBefore: string, moveCode: string) => {
    const game = new Chess(positionBefore);
    game.move(moveCode);
    return game.fen();
  };

  return {
    onMakeMove,
    onMakeMoveActive,
    onResign,
    getPositionAfterMove,
    chessGame,
    user: !!userId ? userData : user,
    opponentData,
    history,
    activeMove,
  };
};
