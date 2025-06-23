const chatService = require("../service/chatService");
const chatClients = require("../wss clients/chatClient");

class ChatController {
  async connect(ws, req) {
    try {
      ws.user = req.user;
      chatClients.add(ws);
      ws.send(
        JSON.stringify({
          method: "initChat",
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
      chatClients.delete(ws);
    } catch (error) {
      console.log(error);
    }
  }

  async getUserChats(ws, req) {
    try {
      const chats = await chatService.getUserChats(req.user.id);
      ws.send(
        JSON.stringify({
          method: "getAllChats",
          data: {
            chats,
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

  async getChatById(ws, msg, req) {
    try {
      if (!msg.chatId) {
        throw ApiError.badRequest("not valid message schema");
      }
      const chatFullInfo = await chatService.getFullChatInfo(
        msg.chatId,
        req.user.id
      );
      ws.send(
        JSON.stringify({
          method: "chatInfo",
          data: {
            chatFullInfo,
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

  async sendMessage(ws, msg, req) {
    try {
      if (!msg.chatId || !msg.message) {
        throw ApiError.badRequest("not valid message schema");
      }
      const chat = await chatService.sendMessage(
        msg.chatId,
        req.user.id,
        msg.message
      );
      ws.send(
        JSON.stringify({
          method: "sendMessage",
          data: {
            status: 200,
          },
        })
      );
      for (const client of chatClients) {
        if (
          (req.user.id === chat.userOneId &&
            client.user.id === chat.userTwoId) ||
          (req.user.id === chat.userTwoId && client.user.id === chat.userOneId)
        ) {
          client.send(
            JSON.stringify({
              method: "newMessage",
              data: {
                chat,
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
}

module.exports = new ChatController();
