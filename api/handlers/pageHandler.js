const path = require('path');
const { getPageDataFromDb } = require('../../services/dbService');

module.exports.getPageDataById = async (req, res) => {
  const { pageId } = req.params;
  const data = await getPageDataFromDb(pageId);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ message: 'Page not found' });
  }
};

module.exports.getPageDataByName = async (req, res) => {
  const { pageName } = req.params;
  const data = await getPageDataFromDb(pageName);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ message: 'Page not found' });
  }
};

module.exports.serveFrontend = async (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/dist/index.html'));
};
