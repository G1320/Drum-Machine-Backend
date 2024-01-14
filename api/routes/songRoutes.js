const express = require('express');
const songHandler = require('../handlers/songHandler');
const { verifyTokenMw } = require('../../middleware');

const router = express.Router();

router.post('/', verifyTokenMw, songHandler.createAndAddSongToUser);
router.get('/:userId', verifyTokenMw, songHandler.getUserSongs);
router.put('/update-song/:songId', verifyTokenMw, songHandler.updateUserSong);
router.delete('/delete-song/:userId/:songId', verifyTokenMw, songHandler.deleteUserSong);

module.exports = router;
