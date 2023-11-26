import { ChessWsServerMethodsEnum } from "../models/enums/ChessWsMethodsEnum"
import { IGameDto } from "./IGameDto"
import { IMoveDto } from "./IMoveDto"

export interface IMakeChessMoveDto {
  method: ChessWsServerMethodsEnum.MadeMove,
  data: {
    gameInfo: {
      game: IGameDto,
      newMove: IMoveDto
    }
  }
}