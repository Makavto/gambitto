export enum ChessWsMethodsEnum {
  Invite = 'invite',
  MakeMove = 'makeMove',
  DeclineInvitation = 'decline',
  AcceptInvitation = 'accept',
  Resign = 'resign',
  GetGameInfo = 'gameInfo',
  GetAllGames = 'getAllGames',
  GetNotifications = 'chessNotifications'
}

export enum ChessWsServerMethodsEnum {
  Invitation = 'invitation',
  Accepted = 'accepted',
  Declined = 'declined',
  MadeMove = 'madeMove',
  Resigned = 'resigned',
}