const express = require('express');
const router = express.Router();
const { getHtmlFilePath } = require('../../utils/fileUtils');
const { getPageDataFromDb } = require('../../services/dbService');

// Page routing based on pageName
router.get('/pages/:pageName', async (req, res) => {
  const { pageName } = req.params;
  console.log(`Fetching data for pageName: ${pageName}`);
  const dbData = await getPageDataFromDb(pageName);
  const filePath = await getHtmlFilePath(pageName, dbData);
  res.sendFile(filePath);
});

// (API) Get page data by pageName
router.get('/api/pageData/:pageName', async (req, res) => {
  try {
    const { pageName } = req.params;
    const data = await getPageDataFromDb(pageName);
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching page data' });
  }
});

module.exports = router;
