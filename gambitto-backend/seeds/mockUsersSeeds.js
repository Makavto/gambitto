const { User } = require("../models");
const bcrypt = require("bcrypt");

const makeMockUsersSeeds = async () => {
  for (let i = 0; i < 10; i++) {
    await User.create({username: `user${i}`, email: `user${i}@mail.ru`, password: await bcrypt.hash('test', 3)})
  }
}

module.exports = makeMockUsersSeeds;