const express = require('express');
const router = express.Router();
const userController = require('../controllers/UsersUsuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload');

// Criar usuário
router.post('/', userController.create);

// Buscar usuário por id
router.get('/:id', authMiddleware, userController.getById);

// Atualizar usuário
router.put('/:id', authMiddleware, upload.single('imagem'), userController.update);

// Excluir usuário
router.delete('/:id', authMiddleware, userController.remove);

module.exports = router;