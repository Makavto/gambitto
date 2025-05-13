const UserDto = require("../dtos/userDto");
const ApiError = require("../error/ApiError");
const userService = require("../service/userService");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { validationResult } = require("express-validator");

class UserController {
  // Регистрация нового пользователя
  // Проверяет валидность данных и создает нового пользователя
  // Устанавливает начальный рейтинг 800 и рейтинговую девиацию 350
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorsArr = errors.array();
        let errorMessage =
          errorsArr.length === 1
            ? "Поле заполнено некорректно: "
            : "Поля заполнены некорректно: ";
        errorsArr.forEach((err, i) => {
          err.path === "email" && (errorMessage += "e-mail");
          err.path === "password" && (errorMessage += "пароль");
          err.path === "username" && (errorMessage += "логин");
          if (i !== errorsArr.length - 1) errorMessage += ", ";
        });
        return next(ApiError.badRequest(errorMessage));
      }
      const { email, password, username } = req.body;
      const userData = await userService.register(username, email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN_MILLISECONDS),
        httpOnly: true,
        secure: false,
      });
      return res.json(userData);
    } catch (error) {
      return next(error);
    }
  }

  // Авторизация пользователя
  // Проверяет учетные данные и генерирует токены доступа
  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorsArr = errors.array();
        let errorMessage =
          errorsArr.length === 1
            ? "Поле заполнено некорректно: "
            : "Поля заполнены некорректно: ";
        errorsArr.forEach((err, i) => {
          err.path === "email" && (errorMessage += "e-mail");
          err.path === "password" && (errorMessage += "пароль");
          if (i !== errorsArr.length - 1) errorMessage += ", ";
        });
        return next(ApiError.badRequest(errorMessage));
      }
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN_MILLISECONDS),
        httpOnly: true,
        secure: false,
      });
      return res.json(userData);
    } catch (error) {
      return next(error);
    }
  }

  // Выход пользователя из системы
  // Удаляет refresh токен из базы данных и куки
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        next(ApiError.badRequest("User not authorized"));
      }
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (error) {
      return next(error);
    }
  }

  // Обновление токена доступа
  // Проверяет refresh токен и генерирует новую пару токенов
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN_MILLISECONDS),
        httpOnly: true,
        secure: false,
      });
      return res.json(userData);
    } catch (error) {
      return next(error);
    }
  }

  // Поиск пользователей по имени
  // Может фильтровать только друзей пользователя
  async getUsers(req, res, next) {
    try {
      const { searchQuery, onlyFriends } = req.query;
      const users = await userService.getUsers(searchQuery, onlyFriends, req.user.id);
      return res.json(users);
    } catch (error) {
      return next(error);
    }
  }

  // Получение информации о пользователе по ID
  async getUserById(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await userService.getUserById(userId);
      return res.json(user);
    } catch (error) {
      return next(error);
    }
  }

  // Получение информации о текущем пользователе
  async getMe(req, res, next) {
    try {
      const { id } = req.user;
      const user = await userService.getUserById(id);
      return res.json(new UserDto(user));
    } catch (error) {
      return next(error);
    }
  }

  // Получение списка топ-5 пользователей по рейтингу
  async getTop(req, res, next) {
    try {
      const usersTop = await userService.getTopUsers();
      return res.json(usersTop);
    } catch (error) {
      return next(error);
    }
  }

  // Получение статистики пользователя
  // Если userId не указан, возвращает статистику текущего пользователя
  async getUserStats(req, res, next) {
    try {
      const { userId } = req.query;
      const stats = await userService.getUserStats(userId ?? req.user.id);
      return res.json(stats);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UserController();
