export enum FriendshipWsMethodsEnum {
  Invite = 'invite',
  DeclineInvitation = 'decline',
  AcceptInvitation = 'accept',
  Delete = 'delete',
  GetAllFriends = 'getAllFriends'
}

export enum FriendshipWsServerMethodsEnum {
  Invitation = 'invited',
  Accepted = 'accepted',
  Declined = 'declined',
  Deleted = 'deleted',
}