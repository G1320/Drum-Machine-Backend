const path = require('path');
const { getFromDbAndCache } = require('../../services/cacheService');
const ExpressError = require('../../utils/expressError');

module.exports.getPageDataById = async (req, res, next) => {
  try {
    const { kitId } = req.params;
    const data = await getFromDbAndCache(kitId);
    if (data) res.json(data);
    else throw new ExpressError('Page not found', 404);
  } catch (error) {
    console.error(error);
  }
};

module.exports.getPageDataByName = async (req, res, next) => {
  try {
    const { pageName } = req.params;
    const data = await getFromDbAndCache(pageName);
    if (data) res.json(data);
    else throw new ExpressError('Page not found', 404);
  } catch (error) {
    console.error(error);
  }
};

module.exports.serveFrontend = async (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/dist/index.html'));
};
