const path = require('path');

const handleSearchRequest = (req, res) => {
  // const queryString = req.query;
  res.sendFile(path.join(__dirname, '../../views/search/search.html'));
};

module.exports = handleSearchRequest;
