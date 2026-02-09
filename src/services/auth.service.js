const UserUsuario = require('../models/UserUsuario'); // usa seu model real
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
    throw new Error('Credenciais inválidas');
  }

  const where = cpfLimpo ? { cpf: cpfLimpo } : { email: emailNorm };
  const user = await UserUsuario.findOne({ where });

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  // verifyPassword precisa ser async (ver utils/hashPassword)
  const passwordMatch = await verifyPassword(password, user.password);
  if (!passwordMatch) {
    throw new Error('Credenciais inválidas');
  }

  const safeUser = stripPassword(user);

  const token = generateToken({
    id: safeUser.id,
    cpf: safeUser.cpf,
    email: safeUser.email,
    tipo: safeUser.tipo || 'usuario',
  });

  return { token, user: safeUser };
};

const register = async ({ name, email, password }) => {
  const emailNorm = normalizeEmail(email);

  if (!name || !emailNorm || !password) {
    throw new Error('Dados inválidos');
  }

  const existingUser = await UserUsuario.findOne({ where: { email: emailNorm } });
  if (existingUser) {
    throw new Error('Email já cadastrado.');
  }

  const hashedPassword = await hashPassword(password);

  const user = await UserUsuario.create({
    nome: name,          // seu model usa "nome"
    email: emailNorm,
    password: hashedPassword,
    // cpf/telefone podem ser obrigatórios no seu model — se for, mantenha register do UserUsuario.service
  });

  return stripPassword(user);
};

module.exports = { login, register };
