const path = require('path');
const { getAndCachePageDataFromDb } = require('../../services/dbService');
const ExpressError = require('../../utils/expressError'); // Replace with the path to your ExpressError file

module.exports.getPageDataById = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const data = await getAndCachePageDataFromDb(pageId);
    if (data) res.json(data);
    else throw new ExpressError('Page not found', 404);
  } catch (error) {
    next(error);
  }
};

module.exports.getPageDataByName = async (req, res, next) => {
  try {
    const { pageName } = req.params;
    const data = await getAndCachePageDataFromDb(pageName);
    if (data) res.json(data);
    else throw new ExpressError('Page not found', 404);
  } catch (error) {
    next(error);
  }
};

module.exports.serveFrontend = async (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/dist/index.html'));
};
