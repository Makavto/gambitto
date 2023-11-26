import { ChessWsServerMethodsEnum } from "../models/enums/ChessWsMethodsEnum"
import { IGameDto } from "./IGameDto"

export interface IDeclineChessInvitationDto {
  method: ChessWsServerMethodsEnum.Accepted,
  data: {
    game: IGameDto
  }
}