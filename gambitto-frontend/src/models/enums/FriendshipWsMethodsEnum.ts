export enum FriendshipWsMethodsEnum {
  Invite = 'invite',
  DeclineInvitation = 'decline',
  AcceptInvitation = 'accept',
  Delete = 'delete',
  GetAllFriends = 'getAllFriends',
  GetNotifications = 'friendshipNotifications'
}

export enum FriendshipWsServerMethodsEnum {
  Invitation = 'invited',
  Accepted = 'accepted',
  Declined = 'declined',
  Deleted = 'deleted',
}