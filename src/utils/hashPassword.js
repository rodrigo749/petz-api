const crypto = require('crypto');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const verifyPassword = (password, hash) => {
  return hashPassword(password) === hash;
};

module.exports = { hashPassword, verifyPassword };
