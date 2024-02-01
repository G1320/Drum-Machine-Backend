const ExpressError = require('../../utils/expressError');
const { handleDbErrorMsg } = require('../../utils/handleDbErrorMsg');

const handleDbErrorMw = (err, req, res, next) => {
  if (err.name === 'CastError') {
    const errorMessage = `Error when requesting data: ID format is Invalid.`;
    err = new ExpressError(errorMessage, 400);
  } else if (['ValidationError', 'DisconnectedError', 'MongoError'].includes(err.name)) {
    err = new ExpressError(handleDbErrorMsg(err), 400);
  }
  console.error(err.stack);
  next(err);
};

module.exports = handleDbErrorMw;
