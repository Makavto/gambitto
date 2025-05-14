import { Chess } from "chess.js";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { IGameFullInfoDto } from "../../../dtos/IGameFullInfoDto";
import { useAppSelector } from "../../../hooks/redux";
import { ChessWsServerMethodsEnum } from "../../../models/enums/ChessWsMethodsEnum";
import { ChessAPI } from "../../../services/ChessService";
import { UserAPI } from "../../../services/UserService";
import { IHistoryMove } from "../../../models/IHistoryMove";

// Контроллер страницы шахматной игры
// Управляет состоянием игры, ходами и взаимодействием с WebSocket
export const useGamePageController = () => {
  const { gameId, userId } = useParams();

  // Хуки для взаимодействия с API
  const [getGameInfo, { data: gameInfoData }] =
    ChessAPI.useLazyGetGameInfoQuery();
  const [getChessNotification, { data: chessListenerData }] =
    ChessAPI.useLazyChessNotificationsListenerQuery();
  const [makeMove, { data: makeMoveData }] = ChessAPI.useLazyMakeMoveQuery();
  const [resign, { data: resignData }] = ChessAPI.useLazyResignQuery();
  const [getOpponent, { data: opponentData }] =
    UserAPI.useLazyGetUserByIdQuery();
  const [getUser, { data: userData }] = UserAPI.useLazyGetUserByIdQuery();

  const navigate = useNavigate();

  // Состояние игры и история ходов
  const [chessGame, setChessGame] = useState<IGameFullInfoDto>();
  const [history, setHistory] = useState<IHistoryMove[][]>([]);
  const [activeMove, setActiveMove] = useState<IHistoryMove>();

  const { user } = useAppSelector((state) => state.userSlice);

  // Инициализация игры при подключении к WebSocket
  useEffect(() => {
    if (!!gameId) {
      getGameInfo({ gameId: Number(gameId) });
      getChessNotification();
    }
  }, []);

  // Получение данных пользователя
  useEffect(() => {
    if (userId) {
      getUser(Number(userId));
    }
  }, [userId]);

  // Переход на страницу анализа игры
  const onAnalysis = () => {
    if (gameId) {
      userId
        ? navigate(`/chess/game/${gameId}/user/${userId}/analysis`)
        : navigate(`/chess/game/${gameId}/analysis`);
    }
  };

  // Сброс и обновление истории ходов
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

  // Обновление состояния игры при получении данных
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

  // Обработка сделанного хода
  useEffect(() => {
    if (!!makeMoveData) {
      setChessGame(makeMoveData.gameFullInfo);
      resetHistory(makeMoveData.gameFullInfo);
    }
  }, [makeMoveData]);

  // Обработка сдачи игры
  useEffect(() => {
    if (!!resignData) {
      setChessGame(resignData.gameFullInfo);
    }
  }, [resignData]);

  // Обработка WebSocket уведомлений
  useEffect(() => {
    if (!!chessListenerData) {
      // Обработка принятия игры
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
      // Обработка отклонения игры
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
      // Обработка сделанного хода
      if (
        chessListenerData.method === ChessWsServerMethodsEnum.MadeMove &&
        chessListenerData.data.gameFullInfo.id === Number(gameId)
      ) {
        setChessGame(chessListenerData.data.gameFullInfo);
        resetHistory(chessListenerData.data.gameFullInfo);
      }
      // Обработка сдачи игры
      if (
        chessListenerData.method === ChessWsServerMethodsEnum.Resigned &&
        chessListenerData.data.gameFullInfo.id === Number(gameId)
      ) {
        setChessGame(chessListenerData.data.gameFullInfo);
      }
    }
  }, [chessListenerData]);

  // Обработчики действий
  const onMakeMove = (moveCode: string) => {
    makeMove({ gameId: Number(gameId), moveCode });
  };

  const onResign = () => {
    resign({ gameId: Number(gameId) });
  };

  const onMakeMoveActive = (newActiveMove: IHistoryMove) => {
    setActiveMove(newActiveMove);
  };

  // Получение позиции после хода
  const getPositionAfterMove = (positionBefore: string, moveCode: string) => {
    const game = new Chess(positionBefore);
    game.move(moveCode);
    return game.fen();
  };

  return {
    onMakeMove,
    onMakeMoveActive,
    onResign,
    onAnalysis,
    getPositionAfterMove,
    chessGame,
    user: !!userId ? userData : user,
    opponentData,
    history,
    activeMove,
  };
};
