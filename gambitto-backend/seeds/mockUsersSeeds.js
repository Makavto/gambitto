const { User } = require("../models");
const bcrypt = require("bcrypt");

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const makeMockUsersSeeds = async () => {
  for (let i = 0; i < 10; i++) {
    
    await User.create({username: `user${i}`, email: `user${i}@mail.ru`, password: await bcrypt.hash('test', 3), rating: getRandomNumber(400, 1000), ratingDeviation: getRandomNumber(100, 350)})
  }
}

module.exports = makeMockUsersSeeds;