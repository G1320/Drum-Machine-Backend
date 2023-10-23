const express = require('express');

const kitHandler = require('../handlers/kitHandler');
const { validateKit } = require('../../middleware/mw');
const authMw = require('../../middleware/authMw');

const router = express.Router();

router.get('/', kitHandler.getAllKits);
router.get('/:kitId', validateKit, kitHandler.getKitById);
router.post('/', authMw, kitHandler.createKit);
router.put('/:kitId', authMw, validateKit, kitHandler.updateKitById);
router.delete('/:kitId', authMw, kitHandler.deleteKitById);
router.get('/:kitId/sounds', kitHandler.getKitSounds);

module.exports = router;
