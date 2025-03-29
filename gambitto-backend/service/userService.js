const User = require("../models/User");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const tokenService = require("./tokenService");
const UserDto = require("../dtos/userDto");
const { Op } = require("sequelize");
const UserTopDto = require("../dtos/userTopDto");
const UserSearchDto = require("../dtos/userSearchDto");
const UserStatsDto = require("../dtos/userStatsDto");

class UserService {
  // Сервис регистрации пользователя
  async register(username, email, password) {
    if (await User.findOne({ where: { email } })) {
      throw ApiError.badRequest(
        `Пользователь с почтовым адресом ${email} уже существует.`
      );
    }
    if (await User.findOne({ where: { username } })) {
      throw ApiError.badRequest(
        `Пользователь с ником ${username} уже существует.`
      );
    }

    const hashedPassword = await bcrypt.hash(password, 3);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      rating: 400,
      ratingDeviation: 350,
    });
    const userDto = new UserDto(user); // username, email, id
    const tokens = tokenService.generateToken({ ...userDto });
    tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  // Сервис авторизации пользователя
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.badRequest(
        "Пользователь с таким почтовым адресом не найден."
      );
    }
    const isPasswordEqual = await bcrypt.compare(password, user.password);
    if (!isPasswordEqual) {
      throw ApiError.badRequest("Неверный пароль");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  // Сервис логаута
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  // Сервис обновления access token
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorized();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.unauthorized();
    }
    const user = await User.findOne({ where: { id: userData.id } });
    const userDto = new UserDto(user); // username, email, id, createdAt
    const tokens = tokenService.generateToken({ ...userDto });
    tokenService.saveToken(user.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  // Поиск по юзерам
  async getUsers(searchQuery, userId) {
    const users = await User.findAll({
      where: {
        username: {
          [Op.iLike]: `%${searchQuery}%`,
        },
        id: { [Op.ne]: userId },
      },
    });
    const userDtos = await Promise.all(
      users.map(async (user) => await new UserSearchDto(user, userId))
    );
    return userDtos;
  }

  // Данные пользователя по айди
  async getUserById(id) {
    const user = await User.findOne({ where: { id } });
    return new UserDto(user);
  }

  async getTopUsers() {
    const users = await User.findAll({
      order: [["rating", "DESC"]],
      limit: 5,
    });

    let response = await Promise.all(
      users.map(async (user) => {
        return await new UserTopDto(user);
      })
    );
    return response;
  }

  async getUserStats(id) {
    const user = await User.findOne({ where: { id } });
    return new UserStatsDto(user);
  }
}

module.exports = new UserService();
