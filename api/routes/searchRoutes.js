const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/pages/search', (req, res) => {
  // const queryString = req.query;
  res.sendFile(path.join(__dirname, '../../views/search/search.html'));
});

module.exports = router;
