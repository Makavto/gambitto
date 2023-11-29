const UserDto = require("../dtos/userDto");
const ApiError = require("../error/ApiError");
const friendshipService = require("../service/friendshipService");
const friendshipClients = require("../wss clients/friendshipClients");

class FrienshipController {
  async connection(ws, req) {
    try {
      ws.user = req.user;
      friendshipClients.add(ws);
      ws.send(JSON.stringify({
        method: 'initFriendship',
        data: {
          status: 'ok'
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

  async getFriends(ws, req) {
    try {
      ws.user = req.user;
      const friendships = await friendshipService.getUserFriends(req.user.id);
      ws.send(JSON.stringify({
        method: 'getAllFriends',
        data: {
          friendships
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
        data: {
          friendship
        }
      }));
      for (const client of friendshipClients) {
        if (client.user.id === msg.inviteeId) {
          client.send(JSON.stringify({
            method: 'invitated',
            data: {
              friendship
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

  async acceptInvitation(ws, msg, req) {
    try {
      if (!msg.invitationId) {
        throw ApiError.badRequest('not valid message schema');
      }
      const friendship = await friendshipService.acceptFriend(msg.invitationId, req.user.id);
      ws.send(JSON.stringify({
        method: 'accept',
        data: {
          friendship
        }
      }));
      for (const client of friendshipClients) {
        if (client.user.id === friendship.friendship.senderId) {
          client.send(JSON.stringify({
            method: 'accepted',
            data: {
              friendship
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

  async declineInvitation(ws, msg, req) {
    try {
      if (!msg.invitationId) {
        throw ApiError.badRequest('not valid message schema');
      }
      const friendship = await friendshipService.declineFriend(msg.invitationId, req.user.id);
      ws.send(JSON.stringify({
        method: 'decline',
        data: {
          friendship
        }
      }));
      for (const client of friendshipClients) {
        if (client.user.id === friendship.friendship.senderId) {
          client.send(JSON.stringify({
            method: 'declined',
            data: {
              friendship
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

  async deleteFriend(ws, msg, req) {
    try {
      if (!msg.invitationId) {
        throw ApiError.badRequest('not valid message schema');
      }
      const friendship = await friendshipService.deleteFriend(msg.invitationId, req.user.id);
      ws.send(JSON.stringify({
        method: 'delete',
        data: {
          friendship
        }
      }));
      for (const client of friendshipClients) {
        if (client.user.id === friendship.friendship.senderId) {
          client.send(JSON.stringify({
            method: 'deleted',
            data: {
              friendship
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