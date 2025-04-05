import { ChessWsServerMethodsEnum } from "../models/enums/ChessWsMethodsEnum"
import { IGameDto } from "./IGameDto"

export interface IChessWsDto {
  method: ChessWsServerMethodsEnum.Accepted | ChessWsServerMethodsEnum.Declined | ChessWsServerMethodsEnum.Invitation,
  data: {
    game: IGameDto
  }
}