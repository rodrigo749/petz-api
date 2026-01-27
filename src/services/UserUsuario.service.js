// CORREÇÃO: Aponta para o arquivo UserUsuario.js na pasta models
const UserUsuario = require('../models/UserUsuario'); 
const bcrypt = require('bcryptjs');

const createUser = async (userData) => {
  // Verifica duplicados usando o modelo UserUsuario
  const existingUser = await UserUsuario.findOne({ where: { email: userData.email } });
  if (existingUser) throw new Error('Email já cadastrado.');

  const existingCpf = await UserUsuario.findOne({ where: { cpf: userData.cpf } });
  if (existingCpf) throw new Error('CPF já cadastrado.');

  // Criptografa senha
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  // Cria usuário
  const newUser = await UserUsuario.create({
    ...userData,
    password: hashedPassword,
  });

  const userResponse = newUser.toJSON();
  delete userResponse.password;

  return userResponse;
};

module.exports = {
  createUser,
};