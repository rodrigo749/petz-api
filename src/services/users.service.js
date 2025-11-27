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
