const express = require("express");
const WsAuthMiddleware = require("../middleware/WsAuthMiddleware");
const friendshipController = require("../controllers/friendshipController");
const router = express.Router();
const ChessWSServer = require('express-ws')(router);

router.ws('/', WsAuthMiddleware, (ws, req, next) => {
  friendshipController.connection(ws, req)
  ws.on('message', (msg) => {
    msg = JSON.parse(msg);
    switch (msg.method) {
      
      case 'invite':
        friendshipController.addFriend(ws, msg, req);
        break;
        
      case 'accept':
        friendshipController.acceptInvitation(ws, msg, req);
        break;

      case 'decline':
        friendshipController.declineInvitation(ws, msg, req);
        break;

      case 'delete':
        friendshipController.deleteFriend(ws, msg, req);
        break;
        
      default:
        ws.send('Not existing endpoint')
        break;
    }
  })
  ws.on('close', () => {
    friendshipController.close(ws);
  })
})

module.exports = router