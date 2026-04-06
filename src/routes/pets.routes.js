const express = require('express');
const multer = require('multer');
const { getPets, getPet, createPet, updatePet, deletePet, getPetImage } = require('../controllers/pets.controller');
const router = express.Router();

// Configuração do multer para armazenar arquivo em memória
const storage = multer.memoryStorage();

// Filtro para garantir que apenas imagens sejam enviadas
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
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB
});

router.get('/', getPets);
router.get('/:id', getPet);
router.get('/:id/image', getPetImage);
router.post('/', upload.single('image'), createPet);
router.put('/:id', upload.single('image'), updatePet);
router.delete('/:id', deletePet);

module.exports = router;
