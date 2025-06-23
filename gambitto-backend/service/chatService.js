const { Op } = require("sequelize");
const ChatDto = require("../dtos/chatDto");
const ApiError = require("../error/ApiError");
const { Chat, User, Message } = require("../models");
const ChatFullInfoDto = require("../dtos/chatFullInfoDto");

class ChatService {
  async createChat(userOneId, userTwoId) {
    const userOne = await User.findOne({ where: { id: userOneId } });
    const userTwo = await User.findOne({ where: { id: userTwoId } });
    if (!userOne || !userTwo || userOne.id === userTwo.id) {
      throw ApiError.badRequest("invalid user id");
    }
    const chat = await Chat.create({
      userOneId,
      userTwoId,
    });
    return await new ChatDto(chat);
  }

  async getUserChats(userId) {
    const chats = await Chat.findAll({
      where: { [Op.or]: [{ userOneId: userId }, { userTwoId: userId }] },
      order: [["createdAt", "DESC"]],
    });
    if (chats.length === 0 || !chats) return [];
    return await Promise.all(
      chats.map(async (chat) => {
        return await new ChatDto(chat);
      })
    );
  }

  async getFullChatInfo(chatId, userId) {
    const chat = await Chat.findOne({
      where: {
        id: chatId,
        [Op.or]: [{ userOneId: userId }, { userTwoId: userId }],
      },
    });
    if (!chat) {
      throw ApiError.badRequest("invalid chat id");
    }
    return await new ChatFullInfoDto(chat);
  }

  async sendMessage(chatId, senderId, message) {
    const sender = await User.findOne({ where: { id: senderId } });
    const chat = await Chat.findOne({ where: { id: chatId } });
    if (!sender || !chat) {
      throw ApiError.badRequest("invalid user id");
    }
    await Message.create({
      userId: senderId,
      chatId,
      message,
    });
    return await new ChatFullInfoDto(chat);
  }
}

module.exports = new ChatService();
