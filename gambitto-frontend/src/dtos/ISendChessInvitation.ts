import { ChessWsMethodsEnum } from "../models/enums/ChessWsMethodsEnum";

export interface ISendChessInvitationDto {
  method: ChessWsMethodsEnum.Invite,
  inviteeId: number
}