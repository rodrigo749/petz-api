const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração de onde e como o arquivo será salvo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/';
    // Garante que a pasta existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Nome único: data + nome original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

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

// A ROTA: POST /api/upload
// O campo 'file' deve ser o mesmo usado no seu frontend: fd.append('file', file)
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    // Monta a URL que o frontend vai salvar no banco de dados
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    return res.status(200).json({
      message: 'Upload realizado com sucesso!',
      url: fileUrl, // Este campo é o que seu frontend lê
      filename: req.file.filename
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;