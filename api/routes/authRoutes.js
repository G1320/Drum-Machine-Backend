const express = require('express');
const authHandler = require('../handlers/authHandler');
const { validateUser } = require('../../middleware/middleware');

const router = express.Router();

router.post('/register', validateUser, authHandler.createAndRegisterUser);
router.post('/login', authHandler.loginUser);
router.get('/me', authHandler.getUserDetails);

module.exports = router;
