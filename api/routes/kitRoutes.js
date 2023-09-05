const express = require('express');
const kitHandler = require('../handlers/kitHandler');

const router = express.Router();

router.get('/', kitHandler.getAllCategories);
router.get('/:kitName', kitHandler.getKitByName);
router.post('/', kitHandler.createKit);
router.put('/:kitName', kitHandler.updateKitByName);
router.delete('/:kitName', kitHandler.deleteKitByName);

module.exports = router;
