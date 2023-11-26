import { ChessWsServerMethodsEnum } from "../models/enums/ChessWsMethodsEnum";
import { IGameDto } from "./IGameDto";

export interface ISendChessInvitationDto {
  method: ChessWsServerMethodsEnum.Resigned,
  data: {
    game: IGameDto
  }
}