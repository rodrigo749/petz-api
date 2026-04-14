const { verifyToken } = require('../utils/generateToken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        error: { 
          message: 'Token não fornecido.',
          code: 'NO_TOKEN',
        } 
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: { 
          message: 'Token inválido.',
          code: 'INVALID_TOKEN',
        } 
      });
    }

    const decoded = verifyToken(token);
    req.userId = decoded.id;
    req.user = decoded;

    console.log(`✓ Sucesso em validar token para usuário: ${decoded.id}`);
    next();
  } catch (error) {
    console.error('✗ Erro na autenticação:', error.message);
    res.status(401).json({ 
      success: false,
      error: { 
        message: 'Token inválido ou expirado.',
        code: 'AUTH_ERROR',
      } 
    });
  }
};

module.exports = authMiddleware;
