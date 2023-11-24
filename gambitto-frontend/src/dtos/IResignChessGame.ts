import { ChessWsMethodsEnum } from "../models/enums/ChessWsMethodsEnum";

export interface IResignChessGameDto {
  method: ChessWsMethodsEnum.Resign,
  gameId: number
}