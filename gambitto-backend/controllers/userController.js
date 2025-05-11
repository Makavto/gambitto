const UserDto = require("../dtos/userDto");
const ApiError = require("../error/ApiError");
const userService = require("../service/userService");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { validationResult } = require("express-validator");

class UserController {
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

  async getUsers(req, res, next) {
    try {
      const { searchQuery, onlyFriends } = req.query;
      const users = await userService.getUsers(searchQuery, onlyFriends, req.user.id);
      return res.json(users);
    } catch (error) {
      return next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await userService.getUserById(userId);
      return res.json(user);
    } catch (error) {
      return next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const { id } = req.user;
      const user = await userService.getUserById(id);
      return res.json(new UserDto(user));
    } catch (error) {
      return next(error);
    }
  }

  async getTop(req, res, next) {
    try {
      const usersTop = await userService.getTopUsers();
      return res.json(usersTop);
    } catch (error) {
      return next(error);
    }
  }

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
