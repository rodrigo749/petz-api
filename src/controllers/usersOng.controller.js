const usersService = require('../services/usersOng.service');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.json({ user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await usersService.updateUser(req.params.id, req.body);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await usersService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, avatar } = req.body;
    const user = await usersService.createUser({ name, email, password, role, phone, avatar });

    // Gera token JWT se JWT_SECRET estiver configurado
    let token = null;
    if (process.env.JWT_SECRET) {
      token = jwt.sign(
        { id: user.id, tipo: 'ong' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    }

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getUsers, getUser, updateUser, deleteUser, createUser };
