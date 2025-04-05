const express = require("express");
const chessController = require("../controllers/chessController");
const WsAuthMiddleware = require("../middleware/WsAuthMiddleware");
const router = express.Router();
const ChessWSServer = require("express-ws")(router);

router.ws("/", WsAuthMiddleware, (ws, req, next) => {
  chessController.connect(ws, req);
  ws.on("message", (msg) => {
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

      case "gameInfo":
        chessController.getGameById(ws, msg, req);
        break;

      case "makeMove":
        chessController.makeMove(ws, msg, req);
        break;

      case "resign":
        chessController.resign(ws, msg, req);
        break;

      case "getAllGames":
        chessController.getAllGames(ws, msg, req);
        break;

      case "chessNotifications":
        chessController.getNotifications(ws, req);
        break;

      case "startSearch":
        chessController.startGameSearch(ws, msg, req);
        break;

      case "endSearch":
        chessController.endGameSearch(ws, req);
        break;

      default:
        ws.send(
          JSON.stringify({
            method: "error",
            data: { status: 404, message: "Not existing endpoint" },
          })
        );
        break;
    }
  });
  ws.on("close", () => {
    chessController.close(ws);
  });
});

module.exports = router;
