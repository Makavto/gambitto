const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const friendshipRouter = require("./friendshipRouter");
const chessRouter = require("./chessRouter");
const chatRouter = require("./chatRouter");

router.use('/user', userRouter)
router.use('/friendship', friendshipRouter)
router.use('/chess', chessRouter)
router.use('/chat', chatRouter)

module.exports = router