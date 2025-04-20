import { useRef, useState } from "react";
import { MoveQualityEnum } from "../../../models/enums/MoveQualityEnum";
import { IEvaluation } from "../../../models/IEvaluation";
import {
  parseEvaluations,
  classifyMoveQuality,
} from "../../../utils/chessHelpers";
import { Chess } from "chess.js";
import { IMoveEvaluation } from "../../../models/IMoveEvaluation";
export const useStockfishController = () => {
  const [ready, setReady] = useState(false);
  const stockfishRef = useRef<Worker | null>(null);
  const resolveRef = useRef<((value: any) => void) | null>(null);
  const buffer = useRef<string[]>([]);

  // === Initialization ===
  const startStockfish = () => {
    if (stockfishRef.current) return;

    const worker = new Worker("/js/stockfish-17-lite-single.js");
    stockfishRef.current = worker;

    worker.onmessage = (event) => {
      const line =
        typeof event.data === "string" ? event.data : event.data?.data;
      if (!line) return;
      console.log("received", line);

      buffer.current.push(line);

      if (line === "uciok") {
        worker.postMessage("setoption name MultiPV value 3");
        worker.postMessage("isready");
      } else if (line === "readyok") {
        setReady(true);
      } else if (line.startsWith("bestmove") && resolveRef.current) {
        const parsed = parseEvaluations(buffer.current);
        resolveRef.current(parsed);
        resolveRef.current = null;
        buffer.current = [];
      }
    };
    worker.onerror = (event) => {
      console.log("Stockfish worker error", event);
    };

    worker.postMessage("uci");
  };

  const endStockfish = () => {
    if (stockfishRef.current) {
      stockfishRef.current.terminate();
      stockfishRef.current = null;
    }
    setReady(false);
  };

  const sendCommand = (cmd: string) => {
    stockfishRef.current?.postMessage(cmd);
  };

  const waitEval = (fen: string, moves?: string[]) => {
    return new Promise<IEvaluation[]>((resolve) => {
      resolveRef.current = resolve;
      buffer.current = [];

      sendCommand("ucinewgame");
      sendCommand("isready");

      const position = moves?.length
        ? `position fen ${fen} moves ${moves.join(" ")}`
        : `position fen ${fen}`;
      sendCommand(position);
      sendCommand("go depth 15");
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
        };
      }
      const afterMove = await waitEval(fen, [move]);
  
      const delta =
        (isBlackToMove && topEval?.cp ? -topEval?.cp : topEval?.cp ?? 0) -
        (!isBlackToMove && afterMove[0]?.cp
          ? -afterMove[0]?.cp
          : afterMove[0]?.cp ?? 0);
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
