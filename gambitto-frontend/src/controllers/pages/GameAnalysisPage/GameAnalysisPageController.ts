import { Chess } from "chess.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { IGameFullInfoDto } from "../../../dtos/IGameFullInfoDto";
import { useAppSelector } from "../../../hooks/redux";
import { IHistoryMove } from "../../../models/IHistoryMove";
import { ChessAPI } from "../../../services/ChessService";
import { UserAPI } from "../../../services/UserService";
import { useStockfishController } from "./StockfishController";
import { MoveQualityEnum } from "../../../models/enums/MoveQualityEnum";

export const useGameAnalysisPageController = () => {
  const { gameId, userId } = useParams();

  const [getGameInfo, { data: gameInfoData }] =
    ChessAPI.useLazyGetGameInfoQuery();
  const [getOpponent, { data: opponentData }] =
    UserAPI.useLazyGetUserByIdQuery();

  const [getUser, { data: userData }] = UserAPI.useLazyGetUserByIdQuery();

  const [chessGame, setChessGame] = useState<IGameFullInfoDto>();

  const { chessWsReady } = useAppSelector((state) => state.wsSlice);

  const { user } = useAppSelector((state) => state.userSlice);

  const [history, setHistory] = useState<IHistoryMove[][]>([]);
  const [activeMove, setActiveMove] = useState<IHistoryMove>();
  const [moveEvaluation, setMoveEvaluation] = useState<{
    quality: MoveQualityEnum;
    bestMove: string;
  } | null>(null);
  const [positionEvaluation, setPositionEvaluation] = useState<{
    cp?: number;
    mate?: number;
  } | null>(null);

  const {
    endStockfish,
    startStockfish,
    evaluateMove,
    evaluatePosition,
    getBestMoves,
    ready,
  } = useStockfishController();

  useEffect(() => {
    if (!!chessWsReady && !!gameId) {
      getGameInfo({ gameId: Number(gameId) });
      startStockfish();
    }
    return () => {
      endStockfish();
    };
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

  const onMakeMoveActive = async (newActiveMove: IHistoryMove) => {
    setActiveMove(newActiveMove);
    const evaluation = await evaluateMove(
      newActiveMove.positionBefore,
      sanToUciMove(newActiveMove.positionBefore, newActiveMove.moveCode)
    );
    setMoveEvaluation(evaluation);

    const positionAfter = getPositionAfterMove(
      newActiveMove.positionBefore,
      newActiveMove.moveCode
    );
    const positionEval = await evaluatePosition(positionAfter);
    setPositionEvaluation(positionEval);
  };

  const getPositionAfterMove = (positionBefore: string, moveCode: string) => {
    const game = new Chess(positionBefore);
    game.move(moveCode);
    return game.fen();
  };

  const sanToUciMove = (fen: string, san: string) => {
    const chess = new Chess(fen);
    const move = chess.move(san);

    const uciMove = move.from + move.to + (move.promotion || "");
    return uciMove;
  };

  return {
    onMakeMoveActive,
    getPositionAfterMove,
    chessGame,
    user: !!userId ? userData : user,
    opponentData,
    history,
    activeMove,
    moveEvaluation,
    positionEvaluation,
  };
};
