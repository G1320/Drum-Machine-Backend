const express = require('express');

const kitHandler = require('../handlers/kitHandler');
const { validateKit } = require('../../middleware/mw');
const authMw = require('../../middleware/authMw');

const router = express.Router();

// authMw secures the endpoint to allow only authorized users to perform CRUD on kits
router.get('/', kitHandler.getAllKits);
router.get('/:kitId', validateKit, kitHandler.getKitById);
router.post('/', authMw, kitHandler.createKit);
router.put('/:kitId', authMw, validateKit, kitHandler.updateKitById);
router.delete('/:kitId', authMw, kitHandler.deleteKitById);

module.exports = router;
