const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersOng.controller');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// exemplo: POST /api/users (ajuste o caminho conforme seu arquivo atual)
router.post('/', upload.single('avatar'), usersController.createUser);

module.exports = router;