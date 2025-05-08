const userService = require("../service/userService");
const { User } = require("../models");

describe("User Service", () => {
  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  describe("User Registration", () => {
    it("should register a new user with valid data", async () => {
      const userData = {
        email: "testRegister@example.com",
        password: "password123",
        username: "testuserRegister",
      };

      const result = await userService.register(
        userData.username,
        userData.email,
        userData.password
      );

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(result.user).toHaveProperty("email", userData.email);
      expect(result.user).toHaveProperty("username", userData.username);
    });

    it("should not register a user with existing email", async () => {
      const userData = {
        email: "testRegister@example.com",
        password: "password123",
        username: "testuserRegister",
      };

      await userService.register(
        userData.username,
        userData.email,
        userData.password
      );

      await expect(
        userService.register(
          "differentUsername",
          userData.email,
          "differentPassword"
        )
      ).rejects.toThrow("Пользователь с почтовым адресом");
    });

    it("should not register a user with existing username", async () => {
      const userData = {
        email: "testRegister@example.com",
        password: "password123",
        username: "testuserRegister",
      };

      await userService.register(
        userData.username,
        userData.email,
        userData.password
      );

      await expect(
        userService.register(
          userData.username,
          "different@email.com",
          "differentPassword"
        )
      ).rejects.toThrow("Пользователь с ником");
    });
  });

  describe("User Login", () => {
    const userData = {
      email: "testLogin@example.com",
      password: "password123",
      username: "testLogin",
    };

    beforeEach(async () => {
      await userService.register(
        userData.username,
        userData.email,
        userData.password
      );
    });

    it("should login with valid credentials", async () => {
      const result = await userService.login(userData.email, userData.password);

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(result.user).toHaveProperty("email", userData.email);
      expect(result.user).toHaveProperty("username", userData.username);
    });

    it("should not login with invalid email", async () => {
      await expect(
        userService.login("wrong@email.com", userData.password)
      ).rejects.toThrow("Пользователь с таким почтовым адресом не найден");
    });

    it("should not login with invalid password", async () => {
      await expect(
        userService.login(userData.email, "wrongpassword")
      ).rejects.toThrow("Неверный пароль");
    });
  });

  describe("User Token Management", () => {
    let user;
    let tokens;

    beforeEach(async () => {
      user = await userService.register(
        "testToken",
        "testToken@example.com",
        "password123"
      );
      tokens = await userService.login("testToken@example.com", "password123");
    });

    it("should refresh token successfully", async () => {
      const result = await userService.refresh(tokens.refreshToken);

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(result.user).toHaveProperty("email", "testToken@example.com");
    });

    it("should not refresh token with invalid refresh token", async () => {
      await expect(userService.refresh("invalid-token")).rejects.toThrow();
    });

    it("should logout successfully", async () => {
      const result = await userService.logout(tokens.refreshToken);
      expect(result).toBeDefined();
    });
  });

  describe("User Search and Stats", () => {
    let testUser;

    beforeEach(async () => {
      testUser = await userService.register(
        "testSearch",
        "testSearch@example.com",
        "password123"
      );
    });

    it("should search users by username", async () => {
      const users = await userService.getUsers("testSearch", 0);
      expect(Array.isArray(users)).toBe(true);
    });

    it("should get user stats", async () => {
      const stats = await userService.getUserStats(testUser.user.id);
      expect(stats).toHaveProperty("rating");
    });

    it("should get top users", async () => {
      const topUsers = await userService.getTopUsers();
      expect(Array.isArray(topUsers)).toBe(true);
      expect(topUsers.length).toBeLessThanOrEqual(5);
    });
  });
});
