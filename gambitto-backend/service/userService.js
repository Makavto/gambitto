const User = require("../models/User");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");

class UserService {
  // next - функция мидлвары хэндлера ошибок

  // Сервис регистрации пользователя
  async register(username, email, password, next) {
    if (await User.findOne({email})) {
      return next(ApiError.badRequest(`Пользователь с почтовым адресом ${email} уже существует.`))
    }
    if (await User.findOne({username})) {
      return next(ApiError.badRequest(`Пользователь с ником ${username} уже существует.`));
    }

    const hashedPassword = bcrypt(password, 3);
    const user = await User.create({username, email, password: hashedPassword});
  }

}

module.exports = new UserService();