const UserUsuario = require('../models/UserUsuario'); 
const { hashPassword, verifyPassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

const sanitizeCpf = (value) => String(value || '').replace(/\D/g, '');
const sanitizeCnpj = (value) => String(value || '').replace(/\D/g, '');
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const stripPassword = (userInstance) => {
  if (!userInstance) return null;
  const user = userInstance.toJSON ? userInstance.toJSON() : { ...userInstance };
  delete user.password;
  return user;
};

const login = async ({ cpf, email, cnpj, password }) => {
  const cpfLimpo = sanitizeCpf(cpf);
  const emailNorm = normalizeEmail(email);
  const cnpjLimpo = sanitizeCnpj(cnpj);

  if ((!cpfLimpo && !emailNorm && !cnpjLimpo) || !password) {
    throw new Error('Por favor, informe suas credenciais corretamente.');
  }

  let where = {};
  if (cnpjLimpo) {
    where = { cnpj: cnpjLimpo };
  } else if (cpfLimpo) {
    where = { cpf: cpfLimpo };
  } else {
    where = { email: emailNorm };
  }

  const user = await UserUsuario.findOne({ where });

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
    tipo: safeUser.tipo || (cnpjLimpo ? 'ong' : 'usuario'),
  });

  return { token, user: safeUser };
};

const register = async ({ name, email, password }) => {
  const emailNorm = normalizeEmail(email);

  if (!name || !emailNorm || !password) {
    throw new Error('Dados inválidos para cadastro.');
  }

  const existingUser = await UserUsuario.findOne({ where: { email: emailNorm } });
  if (existingUser) {
    throw new Error('Este e-mail já está cadastrado.');
  }

  const hashedPassword = await hashPassword(password);

  const user = await UserUsuario.create({
    nome: name,
    email: emailNorm,
    password: hashedPassword,
    tipo: 'usuario' 
  });

  return stripPassword(user);
};

module.exports = { login, register };