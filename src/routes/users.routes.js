const express = require('express');
const router = express.Router();

// CORREÇÃO: O nome do arquivo no require deve ser igual ao da sua pasta (UsersUsuario.controller)
const userController = require('../controllers/UsersUsuario.controller');

// Rota POST http://localhost:5000/api/users
router.post('/', userController.create);

module.exports = router;