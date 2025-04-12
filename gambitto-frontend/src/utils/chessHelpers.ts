// === Helpers ===

import { IEvaluation } from "../models/IEvaluation";
import { MoveQualityEnum } from "../models/enums/MoveQualityEnum";

export function parseEvaluations(lines: string[]): IEvaluation[] {
  const evaluations: Record<number, IEvaluation> = {};
  let currentDepth = 0;

  for (const line of lines) {
    if (!line.startsWith("info")) continue;
    const depthMatch = line.match(/depth (\d+)/);
    if (depthMatch) currentDepth = parseInt(depthMatch[1]);

    const multipvMatch = line.match(/multipv (\d+)/);
    const idx = multipvMatch ? parseInt(multipvMatch[1]) - 1 : 0;

    const scoreMatch = line.match(/score (cp|mate) (-?\d+)/);
    const moveMatch = line.match(/ pv ([a-h][1-8][a-h][1-8][qrbn]?)/);

    if (scoreMatch && moveMatch) {
      const [_, type, valueStr] = scoreMatch;
      const move = moveMatch[1];
      const value = parseInt(valueStr);

      evaluations[idx] = {
        ...evaluations[idx],
        move,
        cp: type === "cp" ? value : undefined,
        mate: type === "mate" ? value : undefined,
        pv: line.match(/ pv (.+)/)?.[1].split(" "),
      };
    }
  }

  return Object.values(evaluations).sort((a, b) => {
    const aScore = a.cp ?? (a.mate ? 10000 - Math.abs(a.mate) * 100 : 0);
    const bScore = b.cp ?? (b.mate ? 10000 - Math.abs(b.mate) * 100 : 0);
    return bScore - aScore;
  });
}

export function classifyMoveQuality(delta: number): MoveQualityEnum {
  const abs = Math.abs(delta);
  if (abs < 20) return MoveQualityEnum.Excellent;
  if (abs < 60) return MoveQualityEnum.Good;
  if (abs < 150) return MoveQualityEnum.Inaccuracy;
  if (abs < 500) return MoveQualityEnum.Mistake;
  return MoveQualityEnum.Blunder;
}
