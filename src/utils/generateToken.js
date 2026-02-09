const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  // Em vez de process.env.JWT_SECRET, você coloca a string direto
  const secret = "SuaPalavraSecretaAqui123"; 
  
  return jwt.sign(payload, secret, {
    expiresIn: '7d', 
  });
};

module.exports = generateToken;