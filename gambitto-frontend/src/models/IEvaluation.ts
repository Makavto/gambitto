export interface IEvaluation {
  cp?: number; // centipawns
  mate?: number; // mate in N
  move: string; // suggested move
  pv?: string[]; // principal variation
}
