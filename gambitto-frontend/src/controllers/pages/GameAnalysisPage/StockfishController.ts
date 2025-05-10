import { useRef, useState } from "react";
import { MoveQualityEnum } from "../../../models/enums/MoveQualityEnum";
import { IEvaluation } from "../../../models/IEvaluation";
import {
  parseEvaluations,
  classifyMoveQuality,
} from "../../../utils/chessHelpers";
import { Chess } from "chess.js";
import { IMoveEvaluation } from "../../../models/IMoveEvaluation";

interface IEvaluationTask {
  fen: string;
  moves?: string[];
  resolve: (value: IEvaluation[]) => void;
  reject: (reason?: any) => void;
}

export const useStockfishController = () => {
  const [ready, setReady] = useState(false);
  const stockfishRef = useRef<Worker | null>(null);
  const buffer = useRef<string[]>([]);
  const evaluationQueue = useRef<IEvaluationTask[]>([]);
  const isEvaluating = useRef(false);

  // === Initialization ===
  const startStockfish = () => {
    if (stockfishRef.current) return;

    const worker = new Worker("/js/stockfish-17-lite-single.js");
    stockfishRef.current = worker;

    worker.onmessage = (event) => {
      const line =
        typeof event.data === "string" ? event.data : event.data?.data;
      if (!line) return;

      buffer.current.push(line);

      if (line === "uciok") {
        worker.postMessage("setoption name MultiPV value 3");
        worker.postMessage("isready");
      } else if (line === "readyok") {
        setReady(true);
        processNextEvaluation();
      } else if (
        line.startsWith("bestmove") &&
        evaluationQueue.current.length > 0
      ) {
        const currentTask = evaluationQueue.current[0];
        const parsed = parseEvaluations(buffer.current);
        currentTask.resolve(parsed);
        buffer.current = [];
        evaluationQueue.current.shift();
        isEvaluating.current = false;
        processNextEvaluation();
      }
    };
    worker.onerror = (event) => {
      if (evaluationQueue.current.length > 0) {
        const currentTask = evaluationQueue.current[0];
        currentTask.reject(event);
        evaluationQueue.current.shift();
        isEvaluating.current = false;
        processNextEvaluation();
      }
    };

    worker.postMessage("uci");
  };

  const endStockfish = () => {
    if (stockfishRef.current) {
      stockfishRef.current.terminate();
      stockfishRef.current = null;
    }
    setReady(false);
    evaluationQueue.current = [];
    isEvaluating.current = false;
  };

  const sendCommand = (cmd: string) => {
    stockfishRef.current?.postMessage(cmd);
  };

  const processNextEvaluation = () => {
    if (!isEvaluating.current && evaluationQueue.current.length > 0 && ready) {
      isEvaluating.current = true;
      const currentTask = evaluationQueue.current[0];

      sendCommand("ucinewgame");
      sendCommand("isready");

      const position = currentTask.moves?.length
        ? `position fen ${currentTask.fen} moves ${currentTask.moves.join(" ")}`
        : `position fen ${currentTask.fen}`;
      sendCommand(position);
      sendCommand("go depth 15");
    }
  };

  const waitEval = (fen: string, moves?: string[]) => {
    return new Promise<IEvaluation[]>((resolve, reject) => {
      const task: IEvaluationTask = { fen, moves, resolve, reject };
      evaluationQueue.current.push(task);
      processNextEvaluation();
    });
  };

  const evaluatePosition = async (
    fen: string
  ): Promise<{ cp?: number; mate?: number }> => {
    const evals = await waitEval(fen);
    const chess = new Chess(fen);
    const isBlackToMove = chess.turn() === "b";
    return {
      cp: isBlackToMove && evals[0].cp ? -evals[0].cp : evals[0]?.cp,
      mate: evals[0]?.mate
        ? isBlackToMove
          ? -evals[0].mate
          : evals[0].mate
        : undefined,
    };
  };

  const evaluateMove = async (
    fen: string,
    move: string
  ): Promise<IMoveEvaluation> => {
    try {
      const [topEval] = await waitEval(fen);
      const chess = new Chess(fen);

      // Convert UCI move to SAN
      const bestMoveSan = chess.move(topEval.move).san;

      const isBlackToMove = chess.turn() === "b";
      const afterMove = await waitEval(fen, [move]);
      if (topEval.move === move) {
        return {
          move: { quality: MoveQualityEnum.Best, bestMove: bestMoveSan },
          evaluation: {
            cp: !isBlackToMove && topEval.cp ? -topEval.cp : topEval?.cp,
            mate: topEval?.mate
              ? !isBlackToMove
                ? -topEval.mate
                : topEval.mate
              : undefined,
          },
          bestMoves: afterMove.map((move) => move.move),
        };
      }

      // Calculate delta considering both cp and mate scores
      let delta = 0;

      if (topEval.cp && afterMove[0].cp) {
        delta =
          (isBlackToMove && topEval?.cp ? -topEval?.cp : topEval?.cp ?? 0) -
          (!isBlackToMove && afterMove[0]?.cp
            ? -afterMove[0]?.cp
            : afterMove[0]?.cp ?? 0);
      } else if (afterMove[0]?.mate) {
        const afterMate = afterMove[0].mate;

        if (afterMate > 0 && !topEval.mate) {
          delta = -10000;
        }
      }

      const quality = classifyMoveQuality(delta);
      return {
        move: { quality, bestMove: bestMoveSan },
        evaluation: {
          cp:
            isBlackToMove && afterMove[0]?.cp
              ? -afterMove[0]?.cp
              : afterMove[0]?.cp,
          mate: afterMove[0]?.mate
            ? isBlackToMove
              ? -afterMove[0].mate
              : afterMove[0].mate
            : undefined,
        },
        bestMoves: afterMove.map((move) => move.move),
      };
    } catch (error) {
      throw error;
    }
  };

  const getBestMoves = async (fen: string): Promise<IEvaluation[]> => {
    return await waitEval(fen);
  };

  return {
    startStockfish,
    endStockfish,
    ready,
    evaluatePosition,
    evaluateMove,
    getBestMoves,
  };
};
