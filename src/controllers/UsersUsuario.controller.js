const userService = require('../services/UserUsuario.service');

const create = async (req, res) => {
  try {
    const userData = { ...req.body };
    
    if (req.file) {
      userData.imagem = req.file.buffer;
      userData.imagemMimeType = req.file.mimetype;
    }
    
    // O service agora retorna { token, user }
    const result = await userService.createUser(userData);
    
    
    // Retornamos o objeto completo (que já contém o token e o user)
    return res.status(201).json({ 
      message: 'Usuário criado com sucesso!', 
      token: result.token, // <--- ISSO AQUI ESTAVA FALTANDO!
      user: {
        ...result.user,
        imagem: undefined // Garante que não enviamos o buffer gigante de volta
      }
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    if (error.message.includes('já cadastrado')) return res.status(409).json({ message: error.message });
    return res.status(500).json({ message: 'Erro interno ao criar usuário.', error: error.message });
  }
};

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

    // Se o Multer processou uma imagem, adiciona o buffer aos dados
    if (req.file) {
      userData.imagem = req.file.buffer;
      userData.imagemMimeType = req.file.mimetype;
    }

    const updatedUser = await userService.updateUser(id, userData);
    return res.status(200).json({
      ...updatedUser,
      imagem: undefined,
      hasImage: updatedUser.hasImage
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

const getUserImage = async (req, res) => {
  try {
    const user = await userService.getUserWithImage(req.params.id);
    
    if (!user.imagem) {
      return res.status(404).json({ error: 'Usuário não possui imagem.' });
    }
    
    res.setHeader('Content-Type', user.imagemMimeType || 'image/jpeg');
    res.setHeader('Content-Disposition', `inline; filename="user-${user.id}.jpg"`);
    res.send(user.imagem);
  } catch (error) {
    res.status(404).json({ error: error.message });
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
  getById,
  update,
  remove,
  getUserImage
};
