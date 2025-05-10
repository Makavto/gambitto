const FRIENDSHIP_STATUSES = [
  {
    status: 'invitation',
    statusFormatted: 'Заявка отправлена'
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
    status: 'draw',
    statusFormatted: 'Ничья'
  },
  {
    status: 'stalemate',
    statusFormatted: 'Пат'
  },
  {
    status: 'threefold',
    statusFormatted: 'Ничья. Троекратное повторение позиции'
  },
  {
    status: 'insufficient',
    statusFormatted: 'Ничья. Недостаточность фигур'
  }
]

const GAME_TYPES = [
  {
    type: 'rating',
    typeFormatted: 'Рейтинговая'
  },
  {
    type: 'friendly',
    typeFormatted: 'Товарищеская'
  }
]

const STARTING_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const MAX_OPPONENTS_RATING_RANGE = 200;

module.exports = {
  FRIENDSHIP_STATUSES,
  GAME_STATUSES,
  STARTING_POSITION,
  MAX_OPPONENTS_RATING_RANGE,
  GAME_TYPES
}