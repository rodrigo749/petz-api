const UserUsuario = require('../models/UserUsuario');
const { hashPassword } = require('../utils/hashPassword');
const Pet = require('../models/Pet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllUsers = async () => {
  const users = await UserUsuario.findAll({ attributes: { exclude: ['password', 'imagem'] } });
  return users.map(u => {
    const obj = u.toJSON();
    obj.hasImage = u.imagem !== null && u.imagem !== undefined;
    return obj;
  });
};

const getUserById = async (id) => {
  const user = await UserUsuario.findByPk(id);
  
  if (!user) throw new Error('User not found');
  
  const obj = user.toJSON();
  // Log para ver o nome das colunas no banco

  delete obj.password;
  delete obj.imagem; 
  return obj;
};
const getUserWithImage = async (id) => {
  const user = await UserUsuario.findByPk(id);
  if (!user) throw new Error('User not found');
  return user;
};

const createUser = async (userData) => {
  const existingUser = await UserUsuario.findOne({ where: { email: userData.email } });
  if (existingUser) throw new Error('Email já cadastrado.');

  if (userData.password) {
    userData.password = await hashPassword(userData.password);
  }

  const created = await UserUsuario.create(userData);
  
  // ↓↓↓ ADICIONE ISSO PARA GERAR O TOKEN NO CADASTRO ↓↓↓
  const token = jwt.sign(
    { id: created.id, cpf: created.cpf },
    process.env.JWT_SECRET || 'petz-secret',
    { expiresIn: '7d' }
  );

  const obj = created.toJSON();
  const hasImage = obj.imagem !== null && obj.imagem !== undefined;
  
  delete obj.password;
  delete obj.imagem; 
  obj.hasImage = hasImage;

  // Retorne o token junto com o usuário, igual no login!
  return { token, user: obj }; 
};
const updateUser = async (id, userData) => {
  const user = await UserUsuario.findByPk(id);
  if (!user) throw new Error('User not found');

  if (userData.password) userData.password = await hashPassword(userData.password);

  await user.update(userData);
  const obj = user.toJSON();
  const hasImage = obj.imagem !== null && obj.imagem !== undefined;
  delete obj.password;
  delete obj.imagem; // Não envia blob no JSON
  obj.hasImage = hasImage;
  return obj;
};

const deleteUser = async (id) => {
  const user = await UserUsuario.findByPk(id);
  if (!user) throw new Error('User not found');

  // ESSA LINHA É A QUE FAZ O SEU BOTÃO DO FRONT FUNCIONAR:
  await Pet.destroy({ where: { userId: id } }); 

  await user.destroy();
};

// ↓↓↓ ADICIONADO ↓↓↓
const loginUser = async ({ cpf, password, senha }) => {
  const senhaDigitada = password || senha;
  if (!cpf || !senhaDigitada) {
    throw new Error('CPF ou senha inválidos.');
  }

  const cpfLimpo = String(cpf).replace(/\D/g, '');
  const user = await UserUsuario.findOne({ where: { cpf: cpfLimpo } });

  if (!user) throw new Error('CPF ou senha incorretos.');

  const senhaValida = await bcrypt.compare(senhaDigitada, user.password);
  if (!senhaValida) throw new Error('CPF ou senha incorretos.');

  const token = jwt.sign(
    { id: user.id, cpf: user.cpf },
    process.env.JWT_SECRET || 'petz-secret',
    { expiresIn: '7d' }
  );

  const userResponse = user.toJSON();
  delete userResponse.password;

  return { token, user: userResponse };
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserWithImage,
  createUser,
  updateUser,
  deleteUser,
  loginUser, 
};
