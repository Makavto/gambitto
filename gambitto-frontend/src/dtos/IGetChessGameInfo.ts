import { ChessWsMethodsEnum } from "../models/enums/ChessWsMethodsEnum";

export interface IGetChessNameInfoDto {
  method: ChessWsMethodsEnum.GetGameInfo,
  gameId: number
}