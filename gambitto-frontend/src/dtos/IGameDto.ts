export interface IGameDto {
  id: number,
  senderId: number,
  inviteeId: number,
  createdAt: string,
  updatedAt: string,
  blackPlayerId: number,
  whitePlayerId: number,
  gameStatusId: number
}