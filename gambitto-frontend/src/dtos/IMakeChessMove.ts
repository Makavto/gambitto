import { ChessWsServerMethodsEnum } from "../models/enums/ChessWsMethodsEnum"
import { IGameFullInfoDto } from "./IGameFullInfoDto"

export interface IMakeChessMoveDto {
  method: ChessWsServerMethodsEnum.MadeMove,
  data: {
    gameFullInfo: IGameFullInfoDto
  }
}