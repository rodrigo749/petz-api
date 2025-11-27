const { models } = require('../database');
const { hashPassword, verifyPassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

const login = async (email, password) => {
  const user = await models.User.findOne({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const passwordMatch = verifyPassword(password, user.password);

  if (!passwordMatch) {
    throw new Error('Invalid password');
  }

  const token = generateToken({ id: user.id, email: user.email });
  return { token, user };
};

const register = async (name, email, password) => {
  const existingUser = await models.User.findOne({ where: { email } });

  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = hashPassword(password);
  const user = await models.User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

module.exports = { login, register };
