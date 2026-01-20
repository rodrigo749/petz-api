const express = require('express');
const { getOngs, getOng, createOng } = require('../controllers/ongs.controller');
const router = express.Router();

router.get('/', getOngs);
router.get('/:id', getOng);
router.post('/', createOng);

module.exports = router;
