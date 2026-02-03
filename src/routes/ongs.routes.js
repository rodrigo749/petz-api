const express = require('express');
const {
  getOngs,
  getOng,
  createOng,
  loginOng
} = require('../controllers/ongs.controller');

const router = express.Router();

router.get('/', getOngs);
router.get('/:id', getOng);
router.post('/', createOng);
router.post('/login', loginOng); // 👈 ESSENCIAL

module.exports = router;
