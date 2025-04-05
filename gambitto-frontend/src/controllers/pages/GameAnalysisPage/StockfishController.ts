import { useRef, useState } from "react";
import { MoveQualityEnum } from "../../../models/enums/MoveQualityEnum";
import { IEvaluation } from "../../../models/IEvaluation";
import {
  parseEvaluations,
  classifyMoveQuality,
} from "../../../utils/chessHelpers";

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

  const evaluatePosition = async (fen: string): Promise<number> => {
    const evals = await waitEval(fen);
    return evals[0]?.cp ?? 0;
  };

  const evaluateMove = async (
    fen: string,
    move: string
  ): Promise<{ quality: MoveQualityEnum; diff: number }> => {
    const [topEval] = await waitEval(fen);
    if (topEval.move === move) {
      return { quality: MoveQualityEnum.Excellent, diff: 0 };
    }
    const afterMove = await waitEval(fen, [move]);
    console.log(topEval, afterMove);
    if (afterMove[0].mate) {
      return { quality: MoveQualityEnum.Blunder, diff: 1000 };
    }

    const delta = (topEval.cp ?? 0) - (afterMove[0]?.cp ?? 0);
    const quality = classifyMoveQuality(delta);
    return { quality, diff: delta };
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
