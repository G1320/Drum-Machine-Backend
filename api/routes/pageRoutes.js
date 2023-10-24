const express = require('express');
const router = express.Router();
const { validatePageName } = require('../../middleware');
const { getPageDataByName, serveFrontend, getPageDataById } = require('../handlers/pageHandler');
const handleRequest = require('../../utils/requestHandler');

router.get('/api/pageData/:pageName', validatePageName, handleRequest(getPageDataByName));
router.get('/pages/id/:pageId', serveFrontend);
router.get('/api/pageData/id/:pageId', handleRequest(getPageDataById));

module.exports = router;
