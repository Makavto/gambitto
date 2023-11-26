import { ChessWsServerMethodsEnum } from "../models/enums/ChessWsMethodsEnum"
import { IGameDto } from "./IGameDto"

export interface IDeclineChessInvitationDto {
  method: ChessWsServerMethodsEnum.Declined,
  data: {
    game: IGameDto
  }
}