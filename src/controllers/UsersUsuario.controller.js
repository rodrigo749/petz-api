// CORREÇÃO: Aponta para o arquivo UserUsuario.service.js que está na sua pasta services
const userService = require('../services/UserUsuario.service');

const create = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json({
      message: 'Usuário criado com sucesso!',
      user
    });
  } catch (error) {
    if (error.message.includes('já cadastrado')) {
      return res.status(409).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao criar usuário.' });
  }
};

// ↓↓↓ ADICIONADO ↓↓↓
const login = async (req, res) => {
  try {
    const result = await userService.loginUser(req.body);
    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      ...result
    });
  } catch (error) {
    if (error.message.includes('incorretos')) {
      return res.status(401).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao realizar login.' });
  }
};

module.exports = {
  create,
  login, // ← ADICIONADO
};
