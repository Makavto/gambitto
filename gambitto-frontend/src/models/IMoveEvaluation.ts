import { MoveQualityEnum } from "./enums/MoveQualityEnum";

export interface IMoveEvaluation {
  move: {
    quality: MoveQualityEnum;
    bestMove: string;
  };
  evaluation: {
    cp?: number;
    mate?: number;
  };
  bestMoves?: string[];
}
