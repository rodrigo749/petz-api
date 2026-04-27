const express = require('express');
const router = express.Router();
const multer = require('multer');
const prisma = require('../config/prisma');

// Configuração do multer para armazenar arquivo em memória
const storage = multer.memoryStorage();

// Filtro para garantir que apenas imagens sejam enviadas (Segurança)
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

// Rota para criar pet com imagem como BLOB
// POST /api/upload
// Body: { name, species, breed, age, description, status, gender, location, dateLost, reward, userName, userType, userId }
// File: multipart/form-data com campo 'image'
router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    const file = req.file;
    const { name, species, breed, age, description, status, gender, location, dateLost, reward, userName, userType, userId } = req.body;

    console.log('Arquivo recebido:', {
      filename: file ? file.originalname : null,
      size: file ? file.size : null,
      mimetype: file ? file.mimetype : null
    });

    // Validação básica
    if (!name) {
      return res.status(400).json({ message: 'Nome do pet é obrigatório.' });
    }

    // Criar o pet com a imagem como BLOB
    const pet = await prisma.pet.create({ data: {
      name,
      species: species || null,
      breed: breed || null,
      age: age ? parseInt(age) : null,
      description: description || null,
      status: status || 'available',
      gender: gender || null,
      image: file ? file.buffer : null, // Armazena o buffer como BLOB
      imagemMimeType: file ? file.mimetype : null, // Armazena o tipo MIME
      location: location || null,
      dateLost: dateLost ? new Date(dateLost) : null,
      reward: reward ? Number(reward).toFixed(2) : null,
      userName: userName || null,
      userType: userType || null,
      userId: userId ? parseInt(userId) : null,
    }});

    return res.status(201).json({
      message: 'Pet criado com sucesso e imagem armazenada como BLOB!',
      pet: {
        id: pet.id,
        name: pet.name,
        species: pet.species,
        hasImage: pet.image !== null,
        imageMimeType: pet.imagemMimeType
      }
    });
  } catch (error) {
    console.error('Erro ao criar pet:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Rota para recuperar a imagem de um pet pelo ID
// GET /api/upload/:id
router.get('/:id', async (req, res) => {
  try {
    const pet = await prisma.pet.findUnique({ where: { id: Number(req.params.id) } });

    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' });
    }

    if (!pet.image) {
      return res.status(404).json({ message: 'Pet não possui imagem.' });
    }

    // Define o tipo de conteúdo correto e envia o BLOB
    res.setHeader('Content-Type', pet.imagemMimeType || 'image/jpeg');
    res.setHeader('Content-Disposition', `inline; filename="pet-${pet.id}.jpg"`);
    res.send(pet.image);
  } catch (error) {
    console.error('Erro ao recuperar imagem:', error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;