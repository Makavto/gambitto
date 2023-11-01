const UserDto = require("../dtos/userDto");
const chessService = require("../service/chessService");
const chessClients = require("./chessClients");

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

}

module.exports = new ChessController();