const jwt = require('jsonwebtoken');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const Token = require('../models/Token');

class TokenService {

  // Генерация access и refresh токенов для пользователя
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_EXPIRES_IN});
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN});
    return {
      accessToken,
      refreshToken
    }
  }

  // Сохранение refresh токена в базе данных
  async saveToken(userId, refreshToken) {
    try {
      const tokenData = await Token.findOne({where: {userId}});
      if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save()
      }
      const token = await Token.create({userId, refreshToken});
      return token;
      
    } catch (error) {
    }
  }

  // Удаление refresh токена из базы данных
  async removeToken(refreshToken) {
    const token = await Token.destroy({where: {refreshToken}});
    return token;
  }

  // Поиск refresh токена в базе данных
  async findToken(refreshToken) {
    const token = await Token.findOne({where: {refreshToken}});
    return token;
  }

  // Проверка валидности access токена
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null
    }
  }

  // Проверка валидности refresh токена
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null
    }
  }

}

module.exports = new TokenService();