const validatePageName = require('./validation/validatePageName');
const validateUser = require('./validation/validateUser');
const validateKit = require('./validation/validateKit');
const logRequestsMw = require('./logging/logRequestsMw');
const handleDbErrorMw = require('./errorHandling/handleDbErrorMw');
const handleErrorMw = require('./errorHandling/handleErrorMw');
const verifyTokenMw = require('./authorization/verifyTokenMw');

module.exports = {
  validatePageName,
  validateUser,
  validateKit,
  logRequestsMw,
  handleDbErrorMw,
  handleErrorMw,
  verifyTokenMw,
};
