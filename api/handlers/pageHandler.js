const path = require('path');
const { getAndCacheKitDataFromDb } = require('../../services/cacheService');
const ExpressError = require('../../utils/expressError');

module.exports.getPageDataById = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const data = await getAndCacheKitDataFromDb(pageId);
    if (data) res.json(data);
    else throw new ExpressError('Page not found', 404);
  } catch (error) {
    console.error(error);
  }
};

module.exports.getPageDataByName = async (req, res, next) => {
  try {
    const { pageName } = req.params;
    const data = await getAndCacheKitDataFromDb(pageName);
    if (data) res.json(data);
    else throw new ExpressError('Page not found', 404);
  } catch (error) {
    console.error(error);
  }
};

module.exports.serveFrontend = async (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/dist/index.html'));
};
