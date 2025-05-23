const UserDto = require("../dtos/userDto");
const ApiError = require("../error/ApiError");
const chessService = require("../service/chessService");
const chessClients = require("../wss clients/chessClients");

class ChessController {
  // Получение всех игр пользователя через WebSocket
  async getAllGames(ws, msg, req) {
    try {
      const games = await chessService.getUserGames(msg.userId ?? req.user.id);
      ws.send(
        JSON.stringify({
          method: "getAllGames",
          data: {
            games,
          },
        })
      );
    } catch (error) {
      ws.send(
        JSON.stringify({
          method: "error",
          data: {
            error,
          },
        })
      );
    }
  }

  // Получение уведомлений о приглашениях в игру
  async getNotifications(ws, req) {
    try {
      const games = await chessService.getNotifications(req.user.id);
      ws.send(
        JSON.stringify({
          method: "chessNotifications",
          data: {
            games,
          },
        })
      );
    } catch (error) {
      ws.send(
        JSON.stringify({
          method: "error",
          data: {
            error,
          },
        })
      );
    }
  }

  // Подключение к WebSocket серверу для шахмат
  // При подключении отправляются все активные уведомления
  async connect(ws, req) {
    try {
      ws.user = req.user;
      const games = await chessService.getNotifications(req.user.id);
      chessClients.add(ws);
      ws.send(
        JSON.stringify({
          method: "initChess",
          data: {
            games,
          },
        })
      );
    } catch (error) {
      ws.send(
        JSON.stringify({
          method: "error",
          data: {
            error,
          },
        })
      );
    }
  }

  // Закрытие WebSocket соединения
  close(ws) {
    try {
      chessClients.delete(ws);
    } catch (error) {
      console.log(error);
    }
  }

  // Отправка приглашения на игру другому игроку
  // Отправляет уведомление приглашенному игроку через WebSocket
  async sendInvitation(ws, msg, req) {
    try {
      if (!msg.inviteeId) {
        throw ApiError.badRequest("not valid message schema");
      }
      const newGame = await chessService.sendInvitation(
        req.user.id,
        msg.inviteeId
      );
      ws.send(
        JSON.stringify({
          method: "invite",
          data: {
            game: newGame,
          },
        })
      );
      for (const client of chessClients) {
        if (client.user.id === msg.inviteeId) {
          client.send(
            JSON.stringify({
              method: "invitation",
              data: {
                game: newGame,
                sender: new UserDto(req.user),
              },
            })
          );
          break;
        }
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          method: "error",
          data: {
            error,
          },
        })
      );
    }
  }

  // Начало поиска рейтинговой игры
  // Если найден подходящий соперник, создается новая игра
  async startGameSearch(ws, msg, req) {
    try {
      const game = await chessService.startGameSearch(req.user.id);
      ws.send(
        JSON.stringify({
          method: game ? "accepted" : "startSearch",
          data: {
            game,
          },
        })
      );
      if (game) {
        for (const client of chessClients) {
          if (client.user.id === game.inviteeId) {
            client.send(
              JSON.stringify({
                method: "accepted",
                data: {
                  game,
                },
              })
            );
          }
        }
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          method: "error",
          data: {
            error,
          },
        })
      );
    }
  }

  // Прекращение поиска рейтинговой игры
  async endGameSearch(ws, req) {
    try {
      await chessService.endGameSearch(req.user.id);
      ws.send(
        JSON.stringify({
          method: "endSearch",
        })
      );
    } catch (error) {
      ws.send(
        JSON.stringify({
          method: "error",
          data: {
            error,
          },
        })
      );
    }
  }

  // Принятие приглашения на игру
  // Уведомляет отправителя приглашения о принятии
  async acceptInvitation(ws, msg, req) {
    try {
      if (!msg.gameId) {
        throw ApiError.badRequest("not valid message schema");
      }
      const game = await chessService.acceptInvitation(msg.gameId, req.user.id);
      ws.send(
        JSON.stringify({
          method: "accept",
          data: {
            game,
          },
        })
      );
      for (const client of chessClients) {
        if (client.user.id === game.senderId) {
          client.send(
            JSON.stringify({
              method: "accepted",
              data: {
                game,
              },
            })
          );
          break;
        }
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          method: "error",
          data: {
            error,
          },
        })
      );
    }
  }

  // Отклонение приглашения на игру
  // Уведомляет отправителя приглашения об отклонении
  async declineInvitation(ws, msg, req) {
    try {
      if (!msg.gameId) {
        throw ApiError.badRequest("not valid message schema");
      }
      const game = await chessService.declineInvitation(
        msg.gameId,
        req.user.id
      );
      ws.send(
        JSON.stringify({
          method: "decline",
          data: {
            game,
          },
        })
      );
      for (const client of chessClients) {
        if (client.user.id === game.senderId) {
          client.send(
            JSON.stringify({
              method: "declined",
              data: {
                game,
              },
            })
          );
          break;
        }
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          method: "error",
          data: {
            error,
          },
        })
      );
    }
  }

  // Получение полной информации об игре по её ID
  async getGameById(ws, msg, req) {
    try {
      if (!msg.gameId) {
        throw ApiError.badRequest("not valid message schema");
      }
      const gameFullInfo = await chessService.getGameById(
        msg.gameId,
        req.user.id
      );
      ws.send(
        JSON.stringify({
          method: "gameInfo",
          data: {
            gameFullInfo,
          },
        })
      );
    } catch (error) {
      ws.send(
        JSON.stringify({
          method: "error",
          data: {
            error,
          },
        })
      );
    }
  }

  // Выполнение хода в игре
  // Проверяет валидность хода и обновляет состояние игры
  async makeMove(ws, msg, req) {
    try {
      if (!msg.gameId || !msg.moveCode) {
        throw ApiError.badRequest("not valid message schema");
      }
      const gameFullInfo = await chessService.makeMove(
        msg.moveCode,
        req.user.id,
        msg.gameId
      );
      ws.send(
        JSON.stringify({
          method: "makeMove",
          data: {
            gameFullInfo,
          },
        })
      );
      const opponentId =
        req.user.id !== gameFullInfo.blackPlayerId
          ? gameFullInfo.blackPlayerId
          : gameFullInfo.whitePlayerId;
      for (const client of chessClients) {
        if (client.user.id === opponentId) {
          client.send(
            JSON.stringify({
              method: "madeMove",
              data: {
                gameFullInfo,
              },
            })
          );
        }
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          method: "error",
          data: {
            error,
          },
        })
      );
    }
  }

  // Сдача игры
  // Обновляет статус игры и рейтинги игроков
  async resign(ws, msg, req) {
    try {
      if (!msg.gameId) {
        throw ApiError.badRequest("not valid message schema");
      }
      const gameFullInfo = await chessService.resign(msg.gameId, req.user.id);
      ws.send(
        JSON.stringify({
          method: "resign",
          data: {
            gameFullInfo,
          },
        })
      );
      const opponentId =
        req.user.id !== gameFullInfo.blackPlayerId
          ? gameFullInfo.blackPlayerId
          : gameFullInfo.whitePlayerId;
      for (const client of chessClients) {
        if (client.user.id === opponentId) {
          client.send(
            JSON.stringify({
              method: "resigned",
              data: {
                gameFullInfo,
              },
            })
          );
        }
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          method: "error",
          data: {
            error,
          },
        })
      );
    }
  }
}

module.exports = new ChessController();
