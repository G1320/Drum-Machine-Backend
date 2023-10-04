const express = require('express');
const authHandler = require('../handlers/authHandler');
const { validateUser } = require('../../middleware/mw');
const authMw = require('../../middleware/authMw');

const router = express.Router();

router.post('/register', validateUser, authHandler.createAndRegisterUser);
router.post('/login', authHandler.loginUser);
// router.get('/me', authMw, authHandler.getUserDetails);
router.post('/logout', authHandler.logoutUser);

module.exports = router;
