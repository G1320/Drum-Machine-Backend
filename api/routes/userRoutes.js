const express = require('express');
const userHandler = require('../handlers/userHandler');
const { validateUser, verifyTokenMw } = require('../../middleware');

const router = express.Router();

router.get('/', userHandler.getAllUsers);
router.get('/my-kits/:id', verifyTokenMw, userHandler.getUserKits);
router.post('/', validateUser, userHandler.createUser);
router.put('/:id', verifyTokenMw, validateUser, userHandler.updateUser);
router.delete('/:id', userHandler.deleteUser);

router.post('/:id/add-kit/:kitId', verifyTokenMw, userHandler.addKitToUser);
router.post('/:id/remove-kit/:kitId', verifyTokenMw, userHandler.removeKitFromUser);

module.exports = router;
