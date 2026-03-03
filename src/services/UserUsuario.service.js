const UserUsuario = require('../models/UserUsuario');
const { hashPassword } = require('../utils/hashPassword');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllUsers = async () => {
  return await UserUsuario.findAll({ attributes: { exclude: ['password'] } });
};

const getUserById = async (id) => {
  const user = await UserUsuario.findByPk(id, { attributes: { exclude: ['password'] } });
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
  const obj = created.toJSON();
  delete obj.password;
  return obj;
};

const updateUser = async (id, userData) => {
  const user = await UserUsuario.findByPk(id);
  if (!user) throw new Error('User not found');

  if (userData.password) userData.password = await hashPassword(userData.password);

  await user.update(userData);
  const obj = user.toJSON();
  delete obj.password;
  return obj;
};

const deleteUser = async (id) => {
  const user = await UserUsuario.findByPk(id);
  if (!user) throw new Error('User not found');
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
  createUser,
  updateUser,
  deleteUser,
  loginUser, 
};
