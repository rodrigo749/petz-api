const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  // O nome aqui deve ser igual ao do arquivo .env
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h', // tempo de duração do login
  });
};

module.exports = generateToken;