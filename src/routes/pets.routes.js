const express = require('express');
const { getPets, getPet, createPet, updatePet, deletePet } = require('../controllers/pets.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', getPets);
router.get('/:id', getPet);
router.post('/', authMiddleware, createPet);
router.put('/:id', authMiddleware, updatePet);
router.delete('/:id', authMiddleware, deletePet);

module.exports = router;
