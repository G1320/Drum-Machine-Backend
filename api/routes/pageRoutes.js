const express = require('express');
const router = express.Router();
const { validatePageName } = require('../../middleware/middleware');
const { getPage, getPageData } = require('../handlers/pageHandler'); // Update with the correct path to your pageHandler file
const handleRequest = require('../../utils/requestHandler');

router.get('/pages/:pageName', validatePageName, handleRequest(getPage));
router.get('/api/pageData/:pageName', validatePageName, handleRequest(getPageData));

module.exports = router;
