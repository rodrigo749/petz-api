const requireRole = (...roles) => (req, res, next) => {
  if (!req.userId || !req.user) {
    return res.status(401).json({ 
      success: false,
      error: { 
        message: 'Usuário não autenticado.',
        code: 'NOT_AUTHENTICATED',
      } 
    });
  }

  if (!roles.includes(req.user.tipo)) {
    console.log(`✗ Acesso negado para tipo: ${req.user.tipo}`);
    return res.status(403).json({ 
      success: false,
      error: { 
        message: 'Acesso negado. Permissão insuficiente.',
        code: 'FORBIDDEN',
      } 
    });
  }

  next();
};

module.exports = requireRole;