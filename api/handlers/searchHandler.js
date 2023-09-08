const path = require('path');

module.exports = handleSearchRequest = (req, res) => {
  // const queryString = req.query;
  res.sendFile(path.join(__dirname, '../../views/search/search.html'));
};
