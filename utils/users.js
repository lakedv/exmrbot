const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const adminHash = bcrypt.hashSync('secret', SALT_ROUNDS);

const users = [
  {
    username: 'admin',
    passwordHash: adminHash
  }
];

module.exports = users;