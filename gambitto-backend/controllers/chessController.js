const UserDto = require("../dtos/userDto");
const ApiError = require("../error/ApiError");
const chessService = require("../service/chessService");
const chessClients = require("../wss clients/chessClients");

class ChessController {

  async connection(ws, req) {
    try {
      ws.user = req.user;
      chessClients.add(ws);
      const games = await chessService.getUserGames(req.user.id);
      ws.send(JSON.stringify({
        method: 'init',
        data: {
          games
        }
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        method: 'error',
        data: {
          error
        }
      }))
    }
  }

  close(ws) {
    try {
      chessClients.delete(ws);
    } catch (error) {
      console.log(error);
    }
  }

  async sendInvitation(ws, msg, req) {
    try {
      if (!msg.inviteeId) {
        throw ApiError.badRequest('not valid message schema');
      }
      const newGame = await chessService.sendInvitation(req.user.id, msg.inviteeId);
      ws.send(JSON.stringify({
        method: 'invite',
        data: {
          game: newGame
        }
      }));
      for (const client of chessClients) {
        if (client.user.id === msg.inviteeId) {
          client.send(JSON.stringify({
            method: 'invitation',
            data: {
              game: newGame,
              sender: new UserDto(req.user)
            }
          }));
          break;
        }
      }
      return newGame
    } catch (error) {
      ws.send(JSON.stringify({
        method: 'error',
        data: {
          error
        }
      }))
    }
  }

  async acceptInvitation(ws, msg, req) {
    try {
      if (!msg.gameId) {
        throw ApiError.badRequest('not valid message schema');
      }
      const game = await chessService.acceptInvitation(msg.gameId, req.user.id);
      ws.send(JSON.stringify({
        method: 'accept',
        data: {
          game
        }
      }));
      for (const client of chessClients) {
        if (client.user.id === game.senderId) {
          client.send(JSON.stringify({
            method: 'accepted',
            data: {
              game
            }
          }));
          break;
        }
      }
      return game
    } catch (error) {
      ws.send(JSON.stringify({
        method: 'error',
        data: {
          error
        }
      }))
    }
  }

  async declineInvitation(ws, msg, req) {
    try {
      if (!msg.gameId) {
        throw ApiError.badRequest('not valid message schema');
      }
      const game = await chessService.declineInvitation(msg.gameId, req.user.id);
      ws.send(JSON.stringify({
        method: 'accept',
        data: {
          game
        }
      }));
      for (const client of chessClients) {
        if (client.user.id === game.senderId) {
          client.send(JSON.stringify({
            method: 'declined',
            data: {
              game
            }
          }));
          break;
        }
      }
      return game
    } catch (error) {
      ws.send(JSON.stringify({
        method: 'error',
        data: {
          error
        }
      }))
    }
  }

  async getGameById(ws, msg, req) {
    try {
      if (!msg.gameId) {
        throw ApiError.badRequest('not valid message schema');
      }
      const gameFullInfo = await chessService.getGameById(msg.gameId, req.user.id);
      ws.send(JSON.stringify({
        method: 'gameInfo',
        data: {
          gameFullInfo
        }
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        method: 'error',
        data: {
          error
        }
      }))
    }
  }

  async makeMove(ws, msg, req) {
    try {
      if (!msg.gameId || !msg.moveCode) {
        throw ApiError.badRequest('not valid message schema');
      }
      const gameUpdateInfo = await chessService.makeMove(msg.moveCode, req.user.id, msg.gameId);
      ws.send(JSON.stringify({
        method: 'makeMove',
        data: {
          gameUpdateInfo
        }
      }));
      const opponentId = req.user.id !== gameUpdateInfo.game.blackPlayerId ? gameUpdateInfo.game.blackPlayerId : gameUpdateInfo.game.whitePlayerId;
      for (const client of chessClients) {
        if (client.user.id === opponentId) {
          client.send(JSON.stringify({
            method: 'madeMove',
            data: {
              gameInfo: gameUpdateInfo
            }
          }))
        }
      }
    } catch (error) {
      ws.send(JSON.stringify({
        method: 'error',
        data: {
          error
        }
      }))
    }
  }

  async resign(ws, msg, req) {
    try {
      if (!msg.gameId) {
        throw ApiError.badRequest('not valid message schema');
      }
      const game = await chessService.resign(msg.gameId, req.user.id);
      ws.send(JSON.stringify({
        method: 'resign',
        data: {
          game
        }
      }));
      const opponentId = req.user.id !== game.blackPlayerId ? game.blackPlayerId : game.whitePlayerId;
      for (const client of chessClients) {
        if (client.user.id === opponentId) {
          client.send(JSON.stringify({
            method: 'resigned',
            data: {
              game
            }
          }))
        }
      }
    } catch (error) {
      ws.send(JSON.stringify({
        method: 'error',
        data: {
          error
        }
      }))
    }
  }

}

module.exports = new ChessController();