const {
  Message,
} = require("../models");

module.exports = class ChatFullInfoDto {
  id;
  createdAt;
  userOneId;
  userTwoId;
  messages;

  constructor(chatModel) {
    return (async () => {
      this.id = chatModel.id;
      this.createdAt = chatModel.createdAt;
      this.userOneId = chatModel.userOneId;
      this.userTwoId = chatModel.userTwoId;
      this.messages = await Message.findAll({
        where: { chatId: chatModel.id },
      });
      return this;
    })();
  }
};
