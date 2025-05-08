const friendshipService = require("../service/friendshipService");
const { User, Friendship } = require("../models");

describe("Friendship Service", () => {
  let testUserOne;
  let testUserTwo;

  beforeEach(async () => {
    testUserOne = await User.create({
      email: "test@example.com",
      password: "password123",
      username: "testuser",
      rating: 800,
      ratingDeviation: 350,
    });
    testUserTwo = await User.create({
      email: "test1@example.com",
      password: "password123",
      username: "testuser1",
      rating: 800,
      ratingDeviation: 350,
    });
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  describe("Friend Invitations", () => {
    it("should send friend invitation", async () => {
      const friendshipDto = await friendshipService.addFriend(
        testUserOne.id,
        testUserTwo.id
      );
      expect(friendshipDto.friendshipStatus).toBe("invitation");
      expect(friendshipDto.friendshipStatusFormatted).toBe("Заявка отправлена");
      expect(friendshipDto.senderId).toBe(testUserOne.id);
      expect(friendshipDto.inviteeId).toBe(testUserTwo.id);
      expect(friendshipDto.senderName).toBe("testuser");
      expect(friendshipDto.inviteeName).toBe("testuser1");
    });

    it("should throw error when sending invitation to self", async () => {
      await expect(
        friendshipService.addFriend(testUserOne.id, testUserOne.id)
      ).rejects.toThrow("cannot be friend with yourself");
    });

    it("should throw error when friendship already exists", async () => {
      await friendshipService.addFriend(testUserOne.id, testUserTwo.id);
      await expect(
        friendshipService.addFriend(testUserOne.id, testUserTwo.id)
      ).rejects.toThrow("already friends");
    });
  });

  describe("Friend Acceptance", () => {
    it("should accept friend invitation", async () => {
      const friendshipDto = await friendshipService.addFriend(
        testUserOne.id,
        testUserTwo.id
      );
      const acceptedFriendship = await friendshipService.acceptFriend(
        friendshipDto.id,
        testUserTwo.id
      );
      expect(acceptedFriendship.friendshipStatus).toBe("friends");
      expect(acceptedFriendship.friendshipStatusFormatted).toBe("В друзьях");
    });

    it("should throw error when accepting non-existent invitation", async () => {
      await expect(
        friendshipService.acceptFriend(999, testUserTwo.id)
      ).rejects.toThrow("no such friendship");
    });

    it("should throw error when wrong user tries to accept invitation", async () => {
      const friendshipDto = await friendshipService.addFriend(
        testUserOne.id,
        testUserTwo.id
      );
      await expect(
        friendshipService.acceptFriend(friendshipDto.id, testUserOne.id)
      ).rejects.toThrow("no such friendship");
    });
  });

  describe("Friend Declining", () => {
    it("should decline friend invitation", async () => {
      const friendshipDto = await friendshipService.addFriend(
        testUserOne.id,
        testUserTwo.id
      );
      const declinedFriendship = await friendshipService.declineFriend(
        friendshipDto.id,
        testUserTwo.id
      );
      expect(declinedFriendship.friendshipStatus).toBe("invitation");
      expect(declinedFriendship.friendshipStatusFormatted).toBe(
        "Заявка отправлена"
      );
    });

    it("should throw error when declining non-existent invitation", async () => {
      await expect(
        friendshipService.declineFriend(999, testUserTwo.id)
      ).rejects.toThrow("no such friendship");
    });
  });

  describe("Friend Management", () => {
    it("should get all friends", async () => {
      const friendshipDto = await friendshipService.addFriend(
        testUserOne.id,
        testUserTwo.id
      );
      await friendshipService.acceptFriend(friendshipDto.id, testUserTwo.id);
      const friends = await friendshipService.getUserFriends(testUserOne.id);
      expect(Array.isArray(friends)).toBe(true);
      expect(friends.length).toBeGreaterThan(0);
      expect(friends[0].friendshipStatus).toBe("friends");
      expect(friends[0].friendshipStatusFormatted).toBe("В друзьях");
      expect(friends[0].senderName).toBe("testuser");
      expect(friends[0].inviteeName).toBe("testuser1");
    });

    it("should delete friend", async () => {
      const friendshipDto = await friendshipService.addFriend(
        testUserOne.id,
        testUserTwo.id
      );
      await friendshipService.acceptFriend(friendshipDto.id, testUserTwo.id);
      const deletedFriendship = await friendshipService.deleteFriend(
        friendshipDto.id,
        testUserOne.id
      );
      expect(deletedFriendship.friendshipStatus).toBe("friends");
      expect(deletedFriendship.friendshipStatusFormatted).toBe("В друзьях");
    });

    it("should throw error when deleting non-existent friendship", async () => {
      await expect(
        friendshipService.deleteFriend(999, testUserOne.id)
      ).rejects.toThrow("no such friendship");
    });
  });

  describe("Notifications", () => {
    it("should get friendship notifications", async () => {
      await friendshipService.addFriend(testUserOne.id, testUserTwo.id);
      const notifications = await friendshipService.getNotifications(
        testUserTwo.id
      );
      expect(Array.isArray(notifications)).toBe(true);
      expect(notifications.length).toBeGreaterThan(0);
      expect(notifications[0].friendshipStatus).toBe("invitation");
      expect(notifications[0].friendshipStatusFormatted).toBe(
        "Заявка отправлена"
      );
      expect(notifications[0].senderName).toBe("testuser");
      expect(notifications[0].inviteeName).toBe("testuser1");
    });

    it("should return empty array when no notifications", async () => {
      const notifications = await friendshipService.getNotifications(
        testUserOne.id
      );
      expect(Array.isArray(notifications)).toBe(true);
      expect(notifications.length).toBe(0);
    });
  });
});
