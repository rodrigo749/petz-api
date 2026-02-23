const express = require('express');
const router = express.Router();

// CORREÇÃO: O nome do arquivo no require deve ser igual ao da sua pasta (UsersUsuario.controller)
const userController = require('../controllers/UsersUsuario.controller');

router.post('/', userController.create);
router.post('/login', userController.login); // ← ADICIONADO

module.exports = router;
