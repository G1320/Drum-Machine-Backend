const express = require('express');
const userHandler = require('../handlers/userHandler');
const { validateUser } = require('../../middleware/middleware');

const router = express.Router();

router.get('/', userHandler.getAllUsers);
router.post('/', validateUser, userHandler.createUser);
router.put('/:id', validateUser, userHandler.updateUser);
router.delete('/:id', userHandler.deleteUser);

module.exports = router;
