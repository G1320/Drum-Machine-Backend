const express = require('express');
const router = express.Router();
const { getHtmlFilePath } = require('../../utils/fileUtils');
const { getPageDataFromDb } = require('../../services/dbService');
const handleRequest = require('../../utils/requestHandler');
const { validatePageName } = require('../../middleware/middleware');

// Page routing based on pageName
//prettier-ignore
router.get('/pages/:pageName', validatePageName, 
  handleRequest(async (req, res) => {
    const { pageName } = req.params;
    console.log(`Fetching data for pageName: ${pageName}`);
    const dbData = await getPageDataFromDb(pageName);
    const filePath = await getHtmlFilePath(pageName, dbData);
    res.sendFile(filePath);  })
);

// (API) Get page data by pageName
//prettier-ignore
router.get('/api/pageData/:pageName', validatePageName, 
  handleRequest(async (req, res) => {
    const { pageName } = req.params;
    const data = await getPageDataFromDb(pageName);
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  })
);

module.exports = router;
