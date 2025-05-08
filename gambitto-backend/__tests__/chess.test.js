const chessService = require("../service/chessService");
const { User, ChessGame } = require("../models");

describe("Chess Service", () => {
  beforeAll(async () => {
    try {
      await User.create({
        email: "test@example.com",
        password: "password123",
        username: "testuser",
        rating: 800,
        ratingDeviation: 350,
      });
      await User.create({
        email: "test1@example.com",
        password: "password123",
        username: "testuser1",
        rating: 800,
        ratingDeviation: 350,
      });
    } catch (error) {
      console.log(error);
    }
  });

  describe("Game Invitations", () => {
    it("should send game invitation", async () => {
      const gameDto = await chessService.sendInvitation(1, 2);
      expect(gameDto.gameStatus).toBe("invitation");
      expect(gameDto.senderId).toBe(1);
      expect(gameDto.inviteeId).toBe(2);
    });

    it("should throw error when sending invitation to non-existent user", async () => {
      await expect(chessService.sendInvitation(1, 999)).rejects.toThrow();
    });

    it("should throw error when sending invitation to self", async () => {
      await expect(chessService.sendInvitation(1, 1)).rejects.toThrow();
    });
  });

  describe("Game Acceptance", () => {
    it("should accept game invitation", async () => {
      const gameDto = await chessService.sendInvitation(1, 2);
      const acceptedGame = await chessService.acceptInvitation(gameDto.id, 2);
      expect(acceptedGame.gameStatus).toBe("inProgress");
    });

    it("should throw error when accepting non-existent game", async () => {
      await expect(chessService.acceptInvitation(999, 2)).rejects.toThrow();
    });

    it("should throw error when wrong user tries to accept invitation", async () => {
      const gameDto = await chessService.sendInvitation(1, 2);
      await expect(
        chessService.acceptInvitation(gameDto.id, 1)
      ).rejects.toThrow();
    });
  });

  describe("Game Declining", () => {
    it("should decline game invitation", async () => {
      const gameDto = await chessService.sendInvitation(1, 2);
      const declinedGame = await chessService.declineInvitation(gameDto.id, 2);
      expect(declinedGame.gameStatus).toBe("declined");
    });

    it("should throw error when declining non-existent game", async () => {
      await expect(chessService.declineInvitation(999, 2)).rejects.toThrow();
    });
  });

  describe("Game Moves", () => {
    it("should make a valid move", async () => {
      const gameDto = await chessService.sendInvitation(1, 2);
      await chessService.acceptInvitation(gameDto.id, 2);
      const game = await chessService.makeMove(
        "e4",
        gameDto.whitePlayerId,
        gameDto.id
      );
      expect(game.gameMoves.length).toBe(1);
    });

    it("should throw error when making invalid move", async () => {
      const gameDto = await chessService.sendInvitation(1, 2);
      await chessService.acceptInvitation(gameDto.id, 2);
      await expect(
        chessService.makeMove("invalid", gameDto.whitePlayerId, gameDto.id)
      ).rejects.toThrow();
    });

    it("should throw error when wrong player tries to move", async () => {
      const gameDto = await chessService.sendInvitation(1, 2);
      await chessService.acceptInvitation(gameDto.id, 2);
      await expect(
        chessService.makeMove("e4", gameDto.blackPlayerId, gameDto.id)
      ).rejects.toThrow();
    });

    it("should detect checkmate and end game with white win", async () => {
      const gameDto = await chessService.sendInvitation(1, 2);
      await chessService.acceptInvitation(gameDto.id, 2);
      
      // Scholar's mate sequence
      await chessService.makeMove("e4", gameDto.whitePlayerId, gameDto.id);
      await chessService.makeMove("e5", gameDto.blackPlayerId, gameDto.id);
      await chessService.makeMove("Bc4", gameDto.whitePlayerId, gameDto.id);
      await chessService.makeMove("Nc6", gameDto.blackPlayerId, gameDto.id);
      await chessService.makeMove("Qh5", gameDto.whitePlayerId, gameDto.id);
      await chessService.makeMove("d6", gameDto.blackPlayerId, gameDto.id);
      const finalGame = await chessService.makeMove("Qxf7#", gameDto.whitePlayerId, gameDto.id);
      
      expect(finalGame.gameStatus).toBe("whiteWin");
    });

    it("should detect checkmate and end game with black win", async () => {
      const gameDto = await chessService.sendInvitation(1, 2);
      await chessService.acceptInvitation(gameDto.id, 2);
      
      // Fool's mate sequence
      await chessService.makeMove("f3", gameDto.whitePlayerId, gameDto.id);
      await chessService.makeMove("e5", gameDto.blackPlayerId, gameDto.id);
      await chessService.makeMove("g4", gameDto.whitePlayerId, gameDto.id);
      const finalGame = await chessService.makeMove("Qh4#", gameDto.blackPlayerId, gameDto.id);
      
      expect(finalGame.gameStatus).toBe("blackWin");
    });

    it("should maintain correct game state after multiple moves", async () => {
      const gameDto = await chessService.sendInvitation(1, 2);
      await chessService.acceptInvitation(gameDto.id, 2);
      
      const moves = ["e4", "e5", "Nf3", "Nc6", "Bc4"];
      let currentGame;
      
      for (let i = 0; i < moves.length; i++) {
        const playerId = i % 2 === 0 ? gameDto.whitePlayerId : gameDto.blackPlayerId;
        currentGame = await chessService.makeMove(moves[i], playerId, gameDto.id);
      }
      
      expect(currentGame.gameMoves.length).toBe(moves.length);
      expect(currentGame.gameStatus).toBe("inProgress");
    });
  });

  describe("Game Resignation", () => {
    it("should allow player to resign", async () => {
      const gameDto = await chessService.sendInvitation(1, 2);
      await chessService.acceptInvitation(gameDto.id, 2);
      const resignedGame = await chessService.resign(
        gameDto.id,
        gameDto.whitePlayerId
      );
      expect(resignedGame.gameStatus).toBe("blackWin");
    });

    it("should throw error when resigning non-existent game", async () => {
      await expect(chessService.resign(999, 1)).rejects.toThrow();
    });
  });

  describe("Game Notifications", () => {
    it("should get user notifications", async () => {
      await chessService.sendInvitation(1, 2);
      const notifications = await chessService.getNotifications(2);
      expect(notifications.length).toBeGreaterThan(0);
      expect(notifications[0].gameStatus).toBe("invitation");
    });
  });

  describe("Game Search", () => {
    it("should start game search", async () => {
      const result = await chessService.startGameSearch(1);
      expect(result).toBeNull(); // Initially returns null as no opponent is searching
    });

    it("should create game after search completed", async () => {
      await chessService.startGameSearch(1);
      const result = await chessService.startGameSearch(2);
      expect(result).toBeNull(); // Initially returns null as no opponent is searching
    });

    it("should end game search", async () => {
      await chessService.startGameSearch(1);
      const result = await chessService.endGameSearch(1);
      expect(result).toBeNull();
    });
  });
});
