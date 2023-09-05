const morgan = require('morgan');
const Joi = require('joi');

const validatePageName = (req, res, next) => {
  const schema = Joi.object({
    pageName: Joi.string().alphanum().min(2).max(30).required(),
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  next();
};

const handleDbErrorMw = (err, req, res, next) => {
  if (['CastError', 'ValidationError', 'DisconnectedError', 'MongoError'].includes(err.name)) {
    err.message = handleDbError(err);
  }
  console.error(err.stack);
  next(err);
};

const handleDbError = (error) => {
  switch (error.name) {
    case 'CastError':
      console.error('Invalid ID format:', error);
      return 'Invalid request data';
    case 'ValidationError':
      console.error('Validation Error:', error);
      return 'Data validation failed';
    case 'DisconnectedError':
      console.error('Disconnected from database:', error);
      return 'Database connection lost';
    case 'MongoError':
      console.error('MongoDB Error:', error);
      return 'An error occurred with MongoDB';
    default:
      console.error('Unknown database error:', error);
      return 'An unknown error occurred';
  }
};

const handleErrorMw = (err, req, res, next) => {
  const { statusCode, message } = err;
  err.status(statusCode || 500).send(message || 'Something went wrong!');
};

const logRequestsMw = morgan('tiny');

module.exports = {
  handleDbErrorMw,
  logRequestsMw,
  handleErrorMw,
  validatePageName,
};
