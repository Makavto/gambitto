const ApiError = require("../error/ApiError");
const tokenService = require("../service/tokenService");

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(new ApiError.unauthorized());
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(new ApiError.unauthorized());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(new ApiError.unauthorized());
    }

    req.user = userData;
    next();
  } catch (error) {
    return next(ApiError.unauthorized())
  }
}