const FRIENDSHIP_STATUSES = [
  {
    status: 'none',
    statusFormatted: 'Не в друзьях'
  },
  {
    status: 'invitation',
    statusFormatted: 'Заявка отправлена'
  },
  {
    status: 'declined',
    statusFormatted: 'Заявка отклонена'
  },
  {
    status: 'friends',
    statusFormatted: 'В друзьях'
  }
];

const GAME_STATUSES = [
  {
    status: 'invitation',
    statusFormatted: 'Приглашение отправлено'
  },
  {
    status: 'declined',
    statusFormatted: 'Приглашение отклонено'
  },
  {
    status: 'inProgress',
    statusFormatted: 'Партия в процессе'
  },
  {
    status: 'blackWin',
    statusFormatted: 'Чёрные победили'
  },
  {
    status: 'whiteWin',
    statusFormatted: 'Белые победили'
  },
  {
    status: 'pat',
    statusFormatted: 'Ничья'
  }
]

module.exports = {
  FRIENDSHIP_STATUSES,
  GAME_STATUSES
}