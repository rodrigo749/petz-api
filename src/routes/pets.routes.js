const express = require('express');
const { getPets, getPet, createPet, updatePet, deletePet } = require('../controllers/pets.controller');
const router = express.Router();

router.get('/', getPets);
router.get('/:id', getPet);
router.post('/', createPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

module.exports = router;
