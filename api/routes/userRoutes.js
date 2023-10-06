const express = require('express');
const userHandler = require('../handlers/userHandler');
const { validateUser } = require('../../middleware/mw');
const authMw = require('../../middleware/authMw');

const router = express.Router();

router.get('/', userHandler.getAllUsers);
router.get('/my-kits/:id', authMw, userHandler.getUserKits);
router.post('/', validateUser, userHandler.createUser);
router.put('/:id', validateUser, userHandler.updateUser);
router.delete('/:id', userHandler.deleteUser);
router.post('/:id/add-kit/:kitId', authMw, userHandler.addKitToUser);
router.post('/:id/remove-kit/:kitId', authMw, userHandler.removeKitFromUser);
module.exports = router;
