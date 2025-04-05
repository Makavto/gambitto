import { ChessWsServerMethodsEnum } from "../models/enums/ChessWsMethodsEnum"
import { IGameFullInfoDto } from "./IGameFullInfoDto"

export interface IChessWsFullInfoDto {
  method: ChessWsServerMethodsEnum.MadeMove | ChessWsServerMethodsEnum.Resigned,
  data: {
    gameFullInfo: IGameFullInfoDto
  }
}