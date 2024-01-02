const express = require('express');
const router = express.Router();

const kitHandler = require('../handlers/kitHandler');
const { validateKit, verifyTokenMw } = require('../../middleware');

router.get('/', kitHandler.getAllKits);
router.get('/:kitId', kitHandler.getKitById);
router.post('/:userId/create-kit', verifyTokenMw, validateKit, kitHandler.createKit);
router.put('/:kitId', verifyTokenMw, validateKit, kitHandler.updateKitById);
router.put('/:kitId/sounds', kitHandler.updateKitSounds);
router.delete('/:kitId', verifyTokenMw, kitHandler.deleteKitById);
router.get('/:kitId/sounds', kitHandler.getKitSounds);

module.exports = router;
