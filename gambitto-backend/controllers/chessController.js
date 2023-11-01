const UserDto = require("../dtos/userDto");
const chessService = require("../service/chessService");
const tokenService = require("../service/tokenService");
const chessClients = require("./chessClients");

class ChessController {

  connection(ws, req) {
    try {
      ws.user = req.user;
      chessClients.add(ws);
    } catch (error) {
      ws.send(JSON.stringify(error))
    }
  }

  close(ws) {
    try {
      chessClients.delete(ws);
    } catch (error) {
      console.log(error)  
    }
  }

  async sendInvitation(ws, msg, req) {
    try {
      const newGame = await chessService.sendInvitation(req.user.id, msg.inviteeId);
      ws.send(JSON.stringify(newGame));
      for (const client of chessClients) {
        if (client.user.id === msg.inviteeId) {
          client.send(JSON.stringify({
            method: 'invitation',
            game: newGame,
            sender: new UserDto(req.user)
          }));
          break;
        }
      }
      return newGame
    } catch (error) {
      console.log(error)
      ws.send('error')
    }
  }

  async acceptInvitation(ws, msg, req) {
    try {
      const game = await chessService.acceptInvitation(msg.gameId);
      ws.send(JSON.stringify(game));
      for (const client of chessClients) {
        if (client.user.id === game.senderId) {
          client.send(JSON.stringify({
            method: 'accepted',
            game
          }));
          break;
        }
      }
      return game
    } catch (error) {
      ws.send('error')
    }
  }

  async declineInvitation(ws, msg, req) {
    try {
      const game = await chessService.declineInvitation(msg.gameId);
      ws.send(JSON.stringify(game));
      for (const client of chessClients) {
        if (client.user.id === game.senderId) {
          client.send(JSON.stringify({
            method: 'declined',
            game
          }));
          break;
        }
      }
      return game
    } catch (error) {
      ws.send('error')
    }
  }

}

module.exports = new ChessController();