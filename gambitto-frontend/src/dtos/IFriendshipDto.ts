export interface IFriendshipDto {
  id: number,
  createdAt: string,
  senderId: number,
  inviteeId: number,
  senderName: string,
  inviteeName: string,
  friendshipStatus: string,
  friendshipStatusFormatted: string
}