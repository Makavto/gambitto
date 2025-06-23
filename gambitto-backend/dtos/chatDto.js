module.exports = class ChatDto {
  id;
  createdAt;
  userOneId;
  userTwoId;

  constructor(model) {
    this.id = model.id;
    this.createdAt = model.createdAt;
    this.userOneId = model.userOneId;
    this.userTwoId = model.userTwoId;
  }
};
