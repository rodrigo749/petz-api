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

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateUser = async (id, userData) => {
  const user = await models.User.findByPk(id);

  if (!user) {
    throw new Error('User not found');
  }

  // If password is provided, hash it
  if (userData.password) {
    userData.password = hashPassword(userData.password);
  }

  await user.update(userData);
  return user;
};

const deleteUser = async (id) => {
  const user = await models.User.findByPk(id);

  if (!user) {
    throw new Error('User not found');
  }

  await user.destroy();
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };


const createUser = async (userData) => {
  const existingUser = await models.User.findOne({ where: { email: userData.email } });

  if (existingUser) {
    throw new Error('Email already in use');
  }

  if (userData.password) {
    userData.password = hashPassword(userData.password);
  }

  const user = await models.User.create(userData);
  return user;
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, createUser };

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

  if (!user || user.role !== 'ong') {
    throw new Error('ONG not found');
  }

  return user;
};

const createOng = async (ongData) => {
  ongData.role = 'ong';
  return await createUser(ongData);
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, createUser, getAllOngs, getOngById, createOng };
