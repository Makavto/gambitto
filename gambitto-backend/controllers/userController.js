const ApiError = require("../error/ApiError");
const userService = require("../service/userService");
require('dotenv').config();
const {validationResult, cookie} = require('express-validator');

class UserController {

  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest(`Ошибка валидации: ${errors.array().map(err => err.path)}`));
      }
      const {email, password, username} = req.body;
      if (!email || !password || !username) {
        return next(ApiError.badRequest('Not valid request schema'))
      }
      const userData = await userService.register(username, email, password);
      if (!!userData) {
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 2*60*1000, httpOnly: true, secure: true});
        return res.json(userData);
      }
    } catch (error) {
      return next(error)
    }
  }

  async login(req, res, next) {
    try {
      const {email, password} = req.body;
      const userData = await userService.login(email, password);
      if (!!userData) {
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 2*60*1000, httpOnly: true, secure: true});
        return res.json(userData);
      }

    } catch (error) {
      return next(error)
    }
  }

  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      if (!refreshToken) {
        next(ApiError.badRequest('User not authorized'))
      }
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (error) {
      return next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 2*60*1000, httpOnly: true, secure: true});
      return res.json(userData);
    } catch (error) {
      return next(error);
    }
  }

}

module.exports = new UserController();