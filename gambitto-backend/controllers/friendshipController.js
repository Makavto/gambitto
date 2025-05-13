const UserDto = require("../dtos/userDto");
const ApiError = require("../error/ApiError");
const friendshipService = require("../service/friendshipService");
const friendshipClients = require("../wss clients/friendshipClients");

class FrienshipController {
  // Подключение к WebSocket серверу для друзей
  // При подключении отправляются все активные уведомления о запросах в друзья
  async connection(ws, req) {
    try {
      ws.user = req.user;
      friendshipClients.add(ws);
      const friendships = await friendshipService.getNotifications(req.user.id);
      ws.send(JSON.stringify({
        method: 'initFriendship',
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

  // Получение списка всех друзей пользователя
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

  // Закрытие WebSocket соединения
  close(ws) {
    try {
      friendshipClients.delete(ws);
    } catch (error) {
      console.log(error);
    }
  }

  // Отправка запроса в друзья другому пользователю
  // Отправляет уведомление приглашенному пользователю через WebSocket
  async addFriend(ws, msg, req) {
    try {
      if (!msg.inviteeId) {
        throw ApiError.badRequest('not valid message schema');
      }
      const friendship = await friendshipService.addFriend(req.user.id, msg.inviteeId);
      ws.send(JSON.stringify({
        method: 'invite',
        data: {
          friendship
        }
      }));
      for (const client of friendshipClients) {
        if (client.user.id === msg.inviteeId) {
          client.send(JSON.stringify({
            method: 'invited',
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

  // Принятие запроса в друзья
  // Уведомляет отправителя запроса о принятии
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
        if (client.user.id === friendship.senderId) {
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

  // Отклонение запроса в друзья
  // Уведомляет отправителя запроса об отклонении
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
        if (client.user.id === friendship.senderId) {
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

  // Удаление пользователя из списка друзей
  // Уведомляет удаленного пользователя через WebSocket
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
        if (client.user.id === friendship.senderId) {
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

  // Получение уведомлений о запросах в друзья
  async getNotifications(ws, req) {
    try {
      ws.user = req.user;
      const friendships = await friendshipService.getNotifications(req.user.id);
      ws.send(JSON.stringify({
        method: 'friendshipNotifications',
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
}

module.exports = new FrienshipController();