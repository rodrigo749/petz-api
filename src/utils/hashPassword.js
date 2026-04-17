const bcrypt = require('bcryptjs');

// Aumentando saltRounds para 12 (Padrão Sênior)
const saltRounds = 12;

const hashPassword = async (plain) => {
  // Passar o número direto é mais limpo e seguro
  return bcrypt.hash(plain, saltRounds);
};

const verifyPassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};

module.exports = { hashPassword, verifyPassword };