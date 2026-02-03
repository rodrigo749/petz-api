const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users.controller');

const router = express.Router();

// CORREÇÃO: O nome do arquivo no require deve ser igual ao da sua pasta (UsersUsuario.controller)
const userController = require('../controllers/UsersUsuario.controller');

module.exports = router;

