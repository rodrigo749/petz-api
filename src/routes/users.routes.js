const express = require('express');
const validate = require('../middlewares/validate.middleware');
const { userSchema } = require('../validators/user.validator');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/UsersUsuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Configuração do Multer para armazenar em memória (BLOB)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limite
});

// Criar usuário
router.post('/', 
  upload.single('imagem'), 
  validate(userSchema), // Valida antes de chegar no controller
  userController.create
);

// Buscar usuário por id
router.get('/:id', authMiddleware, userController.getById);

// Buscar imagem do usuário
router.get('/:id/image', userController.getUserImage);

// Atualizar usuário
router.put('/:id', authMiddleware, upload.single('imagem'), userController.update);

// Excluir usuário
router.delete('/:id', authMiddleware, userController.remove);

module.exports = router;