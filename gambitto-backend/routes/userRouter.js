const Router = require("express");
const userController = require("../controllers/userController");
const router = new Router();


router.post('/register', userController.register);

router.post('/login', userController.login);

router.post('/logout', userController.logout);

router.get('/refresh', userController.refresh);

module.exports = router