const express = require('express');
const userHandler = require('../handlers/userHandler');

const router = express.Router();

router.post('/', userHandler.createUser);
router.get('/', userHandler.getAllUsers);
router.put('/:id', userHandler.updateUser);
router.delete('/:id', userHandler.deleteUser);

module.exports = router;
