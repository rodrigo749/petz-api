const UserUsuario = require('../models/UserUsuario'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // ← ADICIONADO

const createUser = async (userData) => {
  const existingUser = await UserUsuario.findOne({ where: { email: userData.email } });
  if (existingUser) throw new Error('Email já cadastrado.');

  const existingCpf = await UserUsuario.findOne({ where: { cpf: userData.cpf } });
  if (existingCpf) throw new Error('CPF já cadastrado.');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const newUser = await UserUsuario.create({
    ...userData,
    password: hashedPassword,
  });

  const userResponse = newUser.toJSON();
  delete userResponse.password;

  return userResponse;
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
  createUser,
  loginUser, // ← ADICIONADO
};
