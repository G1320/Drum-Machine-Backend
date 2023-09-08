const express = require('express');
const kitHandler = require('../handlers/kitHandler');
const { validateKit } = require('../../middleware/middleware');

const router = express.Router();

router.get('/', kitHandler.getAllKits);
router.get('/:kitName', validateKit, kitHandler.getKitByName);
router.post('/', kitHandler.createKit);
router.put('/:kitName', validateKit, kitHandler.updateKitByName);
router.delete('/:kitName', kitHandler.deleteKitByName);

module.exports = router;
