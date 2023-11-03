const UserDto = require("../dtos/userDto");
const ApiError = require("../error/ApiError");
const friendshipService = require("../service/friendshipService");
const friendshipClients = require("../wss clients/friendshipClients");

class FrienshipController {
  async connection(ws, req) {
    try {
      ws.user = req.user;
      friendshipClients.add(ws);
      // const games = await chessService.getUserGames(req.user.id);
      // ws.send(JSON.stringify({
      //   method: 'init',
      //   data: {
      //     games
      //   }
      // }));
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
      friendshipClients.delete(ws);
    } catch (error) {
      console.log(error);
    }
  }

  async addFriend(ws, msg, req) {
    try {
      if (!msg.inviteeId) {
        throw ApiError.badRequest('not valid message schema');
      }
      const friendship = await friendshipService.addFriend(req.user.id, msg.inviteeId);
      ws.send(JSON.stringify({
        method: 'invitation',
        data: friendship
      }));
      for (const client of friendshipClients) {
        if (client.user.id === msg.inviteeId) {
          client.send(JSON.stringify({
            method: 'invitation',
            data: {
              newFriendship: friendship,
              sender: new UserDto(req.user)
            }
          }));
          break;
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

module.exports = new FrienshipController();