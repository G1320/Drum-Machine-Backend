const { getPageDataFromDb } = require('../../services/dbService');
const { getHtmlFilePath } = require('../../utils/fileUtils');

module.exports.getPage = async (req, res) => {
  const { pageName } = req.params;
  console.log(`Fetching data for pageName: ${pageName}`);
  const dbData = await getPageDataFromDb(pageName);
  const filePath = await getHtmlFilePath(pageName, dbData);
  res.sendFile(filePath);
};

module.exports.getPageData = async (req, res) => {
  const { pageName } = req.params;
  const data = await getPageDataFromDb(pageName);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ message: 'Page not found' });
  }
};
