const express = require('express');
const router = express.Router();

const userController = require('../controllers/UsersUsuario.controller');

router.post('/', userController.create);
router.post('/login', userController.login); // ← ADICIONADO

module.exports = router;
