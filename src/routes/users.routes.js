const express = require('express');
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
