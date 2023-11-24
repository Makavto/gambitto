import { ChessWsServerMethodsEnum } from "../models/enums/ChessWsMethodsEnum";
import { IGameDto } from "./IGameDto";

export interface IAcceptedChessInvitationDto {
  method: ChessWsServerMethodsEnum.Accepted,
  data: {
    game: IGameDto
  }
}