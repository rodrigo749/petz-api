const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('ERRO CRÍTICO: JWT_SECRET não configurado no .env');
}

const generateToken = (payload, expiresIn = '7d') => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
    console.log('✓ Sucesso em gerar token');
    return token;
  } catch (error) {
    console.error('✗ Erro ao gerar token:', error.message);
    throw new Error('Falha na geração de token');
  }
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('✗ Erro ao verificar token:', error.message);
    throw new Error('Token inválido ou expirado');
  }
};

module.exports = { generateToken, verifyToken };