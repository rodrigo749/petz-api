const UserUsuario = require('../models/UserUsuario');
const { hashPassword, verifyPassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

const sanitizeCpf = (value) => String(value || '').replace(/\D/g, '');
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const stripPassword = (userInstance) => {
  if (!userInstance) return null;
  const user = userInstance.toJSON ? userInstance.toJSON() : { ...userInstance };
  delete user.password;
  return user;
};

const login = async ({ cpf, email, password }) => {
  const cpfLimpo = sanitizeCpf(cpf);
  const emailNorm = normalizeEmail(email);

  if ((!cpfLimpo && !emailNorm) || !password) {
    throw new Error('Por favor, informe suas credenciais corretamente.');
  }

  let user = null;

  if (cpfLimpo) {
    user = await UserUsuario.findOne({ where: { cpf: cpfLimpo } });
  } else if (emailNorm) {
    user = await UserUsuario.findOne({ where: { email: emailNorm } });
  }

  if (!user) {
    throw new Error('Credenciais inválidas. Verifique os dados e tente novamente.');
  }

  const passwordMatch = await verifyPassword(password, user.password);
  if (!passwordMatch) {
    throw new Error('Credenciais inválidas. Verifique os dados e tente novamente.');
  }

  const safeUser = stripPassword(user);

  const token = generateToken({
    id: safeUser.id,
    email: safeUser.email,
    tipo: 'usuario',
  });

  return { token, user: safeUser };
};

const register = async ({ nome, email, password }) => {
  const emailNorm = normalizeEmail(email);

  if (!nome || !emailNorm || !password) {
    throw new Error('Nome, email e senha são obrigatórios.');
  }

  const existingUser = await UserUsuario.findOne({ where: { email: emailNorm } });
  if (existingUser) {
    throw new Error('Email já cadastrado.');
  }

  const hashedPassword = await hashPassword(password);

  const created = await UserUsuario.create({
    nome,
    email: emailNorm,
    password: hashedPassword,
  });

  const user = created.toJSON();
  delete user.password;
  return user;
};

module.exports = { login, register };