import { IMoveDto } from "./IMoveDto";

export interface IGameFullInfoDto {
  id: number,
  createdAt: string,
  blackPlayerId: number,
  whitePlayerId: number,
  blackPlayerName: string,
  whitePlayerName: string,
  gameStatusFormatted: string,
  gameStatus: string,
  gameMoves: IMoveDto[]
}