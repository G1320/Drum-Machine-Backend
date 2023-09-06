const express = require('express');
const router = express.Router();
const handleSearchRequest = require('../handlers/searchHandler');

router.get('/pages/search', handleSearchRequest);

module.exports = router;
