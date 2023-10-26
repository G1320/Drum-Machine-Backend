const express = require('express');
const router = express.Router();
const soundHandler = require('../handlers/soundHandler');

// Sound routes
router.post('/', soundHandler.createSound);
router.get('/', soundHandler.getSounds);
router.get('/:soundId', soundHandler.getSoundById);
router.put('/:soundId', soundHandler.updateSoundById);
router.delete('/:soundId', soundHandler.deleteSoundById);

router.post('/:id/sounds/:soundId', soundHandler.addSoundToKit);
router.delete('/:id/sounds/:soundId', soundHandler.removeSoundFromKit);

module.exports = router;
