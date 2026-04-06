const userService = require('../services/UserUsuario.service');

const create = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json({ message: 'Usuário criado com sucesso!', user });
  } catch (error) {
    if (error.message.includes('já cadastrado')) return res.status(409).json({ message: error.message });
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao criar usuário.' });
  }
};

const login = async (req, res) => {
  try {
    const result = await userService.loginUser(req.body);
    return res.status(200).json({ message: 'Login realizado com sucesso!', ...result });
  } catch (error) {
    if (error.message.includes('incorretos')) return res.status(401).json({ message: error.message });
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao realizar login.' });
  }
};

// --- NOVAS FUNÇÕES ABAIXO ---

const getById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    if (error.message === 'User not found') return res.status(404).json({ message: 'Usuário não encontrado' });
    return res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = { ...req.body };

    // Se o Multer processou uma imagem, adicionamos o caminho dela aos dados
    if (req.file) {
      // Salvamos o caminho relativo para ser acessível via URL
      userData.imagem = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await userService.updateUser(id, userData);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

const remove = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    return res.status(204).send(); // 204 No Content (sucesso sem corpo)
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao excluir conta' });
  }
};

module.exports = {
  create,
  login,
  getById,
  update,
  remove
};
