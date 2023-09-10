const express = require('express');
const kitHandler = require('../handlers/kitHandler');
const { validateKit } = require('../../middleware/middleware');

const router = express.Router();

router.get('/', kitHandler.getAllKits);
router.get('/:kitId', validateKit, kitHandler.getKitById);
router.post('/', kitHandler.createKit);
router.put('/:kitId', validateKit, kitHandler.updateKitById);
router.delete('/:kitId', kitHandler.deleteKitById);

module.exports = router;
