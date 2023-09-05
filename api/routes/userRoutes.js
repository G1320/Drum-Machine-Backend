const express = require('express');
const userHandler = require('../handlers/userHandler');

const router = express.Router();

router.get('/', userHandler.getAllUsers);
router.post('/', userHandler.createUser);
router.put('/:id', userHandler.updateUser);
router.delete('/:id', userHandler.deleteUser);

module.exports = router;
