const prisma = require('../config/prisma');
const { hashPassword, verifyPassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

const sanitizeCpf = (value) => String(value || '').replace(/\D/g, '');
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const stripPassword = (userInstance) => {
  if (!userInstance) return null;
  const user = userInstance.toJSON ? userInstance.toJSON() : { ...userInstance };
  // Verifica se tem imagem antes de remover
  const hasImage = user.imagem !== null && user.imagem !== undefined;
  delete user.password;
  delete user.imagem; // Não envia blob no JSON
  user.hasImage = hasImage;
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
    user = await prisma.userUsuario.findUnique({ where: { cpf: cpfLimpo } });
  } else if (emailNorm) {
    user = await prisma.userUsuario.findUnique({ where: { email: emailNorm } });
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

const register = async (userData) => {
  const emailNorm = normalizeEmail(userData.email);
  const cpf = sanitizeCpf(userData.cpf);

  if (!cpf) {
    throw new Error('CPF é obrigatório.');
  }

  // 1. Validação de Regra de Negócio (O Controller validará o formato via Zod depois)
  const existingUser = await prisma.userUsuario.findUnique({ where: { email: emailNorm } });
  if (existingUser) throw new Error('Email já cadastrado.');

  const existingCpf = await prisma.userUsuario.findUnique({ where: { cpf } });
  if (existingCpf) throw new Error('CPF já cadastrado.');

  const hashedPassword = await hashPassword(userData.password);

  // 2. DTO Manual: Aqui blindamos o banco. 
  // Somente estes campos serão gravados, ignorando "isAdmin" ou "permissoes" extras.
  const created = await prisma.userUsuario.create({ data: {
    nome: userData.nome,
    email: emailNorm,
    password: hashedPassword,
    cpf,
    telefone: userData.telefone || '',
    status: 'ativo' // Valor default definido pelo sistema, não pelo usuário
  }});

  return stripPassword(created);
};

module.exports = { login, register };