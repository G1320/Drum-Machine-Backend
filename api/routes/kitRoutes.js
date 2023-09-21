const express = require('express');
const authHandler = require('../../middleware/authHandler');
const kitHandler = require('../handlers/kitHandler');
const { validateKit } = require('../../middleware/middleware');

const router = express.Router();

router.get('/my-kits', authHandler, async (req, res) => {
  try {
    const kits = await kitHandler.getAllKits(req); // You might need to update the handler function to filter kits based on user ID using req.user._id
    res.send(kits);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/', kitHandler.getAllKits);
router.get('/:kitId', validateKit, kitHandler.getKitById);
router.post('/', authHandler, kitHandler.createKit); // Securing the endpoint to allow authorized users to create kits
router.put('/:kitId', authHandler, validateKit, kitHandler.updateKitById); // Securing the endpoint to allow only authorized users to update kits
router.delete('/:kitId', authHandler, kitHandler.deleteKitById); // Securing the endpoint to allow only authorized users to delete kits

module.exports = router;
