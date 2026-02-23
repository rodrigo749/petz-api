const { models } = require('../database');
const { hashPassword } = require('../utils/hashPassword');

const getAllUsers = async () => {
  return await models.User.findAll({
    attributes: { exclude: ['password'] },
  });
};

const getUserById = async (id) => {
  const user = await models.User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
  if (!user) throw new Error('User not found');
  return user;
};

const createUser = async (userData) => {
  const existingUser = await models.User.findOne({ where: { email: userData.email } });

  if (existingUser) {
    const err = new Error('Email already in use');
    err.statusCode = 409;
    throw err;
  }

  if (userData.password) {
    // CORREÇÃO: Adicionado await pois hashPassword é async
    userData.password = await hashPassword(String(userData.password));
  }

  try {
    return await models.User.create(userData);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      const err = new Error('Email already in use');
      err.statusCode = 409;
      throw err;
    }
    throw e;
  }
};

const updateUser = async (id, userData) => {
  const user = await models.User.findByPk(id);
  if (!user) throw new Error('User not found');

  if (userData.password) {
    // CORREÇÃO: Adicionado await
    userData.password = await hashPassword(String(userData.password));
  }

  await user.update(userData);
  return user;
};

const deleteUser = async (id) => {
  const user = await models.User.findByPk(id);
  if (!user) throw new Error('User not found');
  await user.destroy();
};

// ONGs (Utiliza a mesma lógica de usuário, mas força o role 'ong')
const getAllOngs = async () => {
  return await models.User.findAll({
    where: { role: 'ong' },
    attributes: { exclude: ['password'] },
  });
};

const getOngById = async (id) => {
  const user = await models.User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
  if (!user || user.role !== 'ong') throw new Error('ONG not found');
  return user;
};

const createOng = async (ongData) => {
  ongData.role = 'ong';
  return await createUser(ongData);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllOngs,
  getOngById,
  createOng,
};