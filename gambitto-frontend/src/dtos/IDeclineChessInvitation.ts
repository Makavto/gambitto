import { ChessWsMethodsEnum } from "../models/enums/ChessWsMethodsEnum";

export interface IDeclineChessInvitationDto {
  method: ChessWsMethodsEnum.DeclineInvitation,
  gameId: number
}