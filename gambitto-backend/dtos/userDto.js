module.exports = class UserDto {
  email;
  id;
  username;

  constructor(model) {
    this.email = model.email;
    this.id = model.id;
    this.username = model.username;
    this.createdAt = model.createdAt;
  }
}