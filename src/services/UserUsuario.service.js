const prisma = require('../config/prisma');
const { hashPassword } = require('../utils/hashPassword');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sanitizeCpf = (value) => String(value || '').replace(/\D/g, '');

const toSafeUser = (user) => {
  if (!user) return null;
  const hasImage = user.imagem !== null && user.imagem !== undefined;
  return {
    ...user,
    password: undefined,
    imagem: undefined,
    hasImage,
  };
};

const getAllUsers = async () => {
  const users = await prisma.userUsuario.findMany({ orderBy: { id: 'desc' } });
  return users.map(toSafeUser);
};

const getUserById = async (id) => {
  const user = await prisma.userUsuario.findUnique({ where: { id: Number(id) } });
  
  if (!user) throw new Error('User not found');

  return toSafeUser(user);
};
const getUserWithImage = async (id) => {
  const user = await prisma.userUsuario.findUnique({ where: { id: Number(id) } });
  if (!user) throw new Error('User not found');
  return user;
};

const createUser = async (userData) => {
  const email = String(userData.email || '').trim().toLowerCase();
  const cpf = sanitizeCpf(userData.cpf);

  if (!cpf) throw new Error('CPF é obrigatório.');

  const existingUser = await prisma.userUsuario.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email já cadastrado.');

  if (cpf) {
    const existingCpf = await prisma.userUsuario.findUnique({ where: { cpf } });
    if (existingCpf) throw new Error('CPF já cadastrado.');
  }

  if (userData.password) {
    userData.password = await hashPassword(userData.password);
  }

  const created = await prisma.userUsuario.create({
    data: {
      nome: userData.nome,
      email,
      cpf,
      telefone: userData.telefone || '',
      password: userData.password,
      imagem: userData.imagem,
      imagemMimeType: userData.imagemMimeType,
      tipo: userData.tipo || 'usuario',
      status: userData.status || 'ativo',
    },
  });
  
  // ↓↓↓ ADICIONE ISSO PARA GERAR O TOKEN NO CADASTRO ↓↓↓
  const token = jwt.sign(
    { id: created.id, cpf: created.cpf },
    process.env.JWT_SECRET || 'petz-secret',
    { expiresIn: '7d' }
  );

  const obj = toSafeUser(created);

  // Retorne o token junto com o usuário, igual no login!
  return { token, user: obj }; 
};
const updateUser = async (id, userData) => {
  const userId = Number(id);
  const user = await prisma.userUsuario.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  if (userData.password) userData.password = await hashPassword(userData.password);

  if (userData.email) {
    const normalizedEmail = String(userData.email).trim().toLowerCase();
    const existingUser = await prisma.userUsuario.findUnique({ where: { email: normalizedEmail } });
    if (existingUser && existingUser.id !== userId) {
      throw new Error('Email já cadastrado.');
    }
    userData.email = normalizedEmail;
  }

  if (userData.cpf) {
    const cpfLimpo = sanitizeCpf(userData.cpf);
    const existingCpf = await prisma.userUsuario.findUnique({ where: { cpf: cpfLimpo } });
    if (existingCpf && existingCpf.id !== userId) {
      throw new Error('CPF já cadastrado.');
    }
    userData.cpf = cpfLimpo;
  }

  const updateData = Object.fromEntries(
    Object.entries(userData).filter(([_, v]) => v !== undefined)
  );

  const updated = await prisma.userUsuario.update({
    where: { id: userId },
    data: updateData,
  });

  return toSafeUser(updated);
};

const deleteUser = async (id) => {
  const userId = Number(id);
  const user = await prisma.userUsuario.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  // ESSA LINHA É A QUE FAZ O SEU BOTÃO DO FRONT FUNCIONAR:
  await prisma.pet.deleteMany({ where: { userId } });

  await prisma.userUsuario.delete({ where: { id: userId } });
};

// ↓↓↓ ADICIONADO ↓↓↓
const loginUser = async ({ cpf, password, senha }) => {
  const senhaDigitada = password || senha;
  if (!cpf || !senhaDigitada) {
    throw new Error('CPF ou senha inválidos.');
  }

  const cpfLimpo = String(cpf).replace(/\D/g, '');
  const user = await prisma.userUsuario.findUnique({ where: { cpf: cpfLimpo } });

  if (!user) throw new Error('CPF ou senha incorretos.');

  const senhaValida = await bcrypt.compare(senhaDigitada, user.password);
  if (!senhaValida) throw new Error('CPF ou senha incorretos.');

  const token = jwt.sign(
    { id: user.id, cpf: user.cpf },
    process.env.JWT_SECRET || 'petz-secret',
    { expiresIn: '7d' }
  );

  const userResponse = toSafeUser(user);

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
