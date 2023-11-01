const express = require("express");
const chessController = require("../controllers/chessController");
const WsAuthMiddleware = require("../middleware/WsAuthMiddleware");
const router = express.Router();
const ChessWSServer = require('express-ws')(router);

router.ws('/', WsAuthMiddleware, (ws, req, next) => {
  chessController.connection(ws, req)
  ws.on('message', (msg) => {
    msg = JSON.parse(msg);
    switch (msg.method) {
      case "invite":
        chessController.sendInvitation(ws, msg, req);
        break;
    
      case "accept":
        chessController.acceptInvitation(ws, msg, req);
        break;

      case "decline":
        chessController.declineInvitation(ws, msg, req);
        break;

      case "getGame":
        chessController.getGameById(ws, msg, req);
        break;

      case "makeMove":
        chessController.makeMove(ws, msg, req);
        break;

      default:
        ws.send('Not existing endpoint')
        break;
    }
  })
  ws.on('close', () => {
    chessController.close(ws);
  })
})

module.exports = router