const ApiError = require("../error/ApiError");
const tokenService = require("../service/tokenService");

module.exports = function (ws, req, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      ws.send('unauthorized');
      return next(ApiError.unauthorized());
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      ws.send('unauthorized');
      return next(ApiError.unauthorized());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      ws.send('unauthorized');
      return next(ApiError.unauthorized());
    }

    req.user = userData;
    next();
  } catch (error) {
    return next(ApiError.unauthorized())
  }
}