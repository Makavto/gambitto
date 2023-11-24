import { ChessWsMethodsEnum } from "../models/enums/ChessWsMethodsEnum";

export interface IMakeChessMoveDto {
  method: ChessWsMethodsEnum.MakeMove,
  gameId: number,
  moveCode: string
}