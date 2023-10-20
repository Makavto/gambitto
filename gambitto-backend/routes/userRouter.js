const Router = require("express");
const userController = require("../controllers/userController");
const router = new Router();
const {body} = require('express-validator');
const AuthMiddleware = require("../middleware/AuthMiddleware");

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({min: 3, max: 32}),
  body('username').isLength({min: 3, max: 20}),
  userController.register
);

router.post('/login', userController.login);

router.post('/logout', userController.logout);

router.get('/refresh', userController.refresh);

router.get('/users', AuthMiddleware, userController.getUsers);

module.exports = router