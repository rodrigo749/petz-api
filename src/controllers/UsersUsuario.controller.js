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

module.exports = {
  create,
};