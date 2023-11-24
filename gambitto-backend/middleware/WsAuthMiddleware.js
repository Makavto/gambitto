const ApiError = require("../error/ApiError");
const tokenService = require("../service/tokenService");

module.exports = function (ws, req, next) {
  try {
    const authorizationHeader = req.headers['sec-websocket-protocol'];
    if (!authorizationHeader) {
      ws.send(JSON.stringify({method: 'error', data: {status: 401, message: 'unauthorized'}}));
      return next(ApiError.unauthorized());
    }
    
    const accessToken = authorizationHeader;
    if (!accessToken) {
      ws.send(JSON.stringify({method: 'error', data: {status: 401, message: 'unauthorized'}}));
      return next(ApiError.unauthorized());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      ws.send(JSON.stringify({method: 'error', data: {status: 401, message: 'unauthorized'}}));
      return next(ApiError.unauthorized());
    }

    req.user = userData;
    next();
  } catch (error) {
    return next(ApiError.unauthorized())
  }
}