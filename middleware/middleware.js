const morgan = require('morgan');

const handleDbErrorMw = (err, req, res, next) => {
  if (['CastError', 'ValidationError', 'DisconnectedError', 'MongoError'].includes(err.name)) {
    handleDbError(err);
  }
  console.error(err.stack);
  res.status(500).send(`Something went wrong!${err.stack}`);
};

const handleDbError = (error) => {
  switch (error.name) {
    case 'CastError':
      console.error('Invalid ID format:', error);
      throw new Error('Invalid request data');
    case 'ValidationError':
      console.error('Validation Error:', error);
      throw new Error('Data validation failed');
    case 'DisconnectedError':
      console.error('Disconnected from database:', error);
      throw new Error('Database connection lost');
    case 'MongoError':
      console.error('MongoDB Error:', error);
      throw new Error('An error occurred with MongoDB');
    default:
      console.error('Unknown database error:', error);
      throw new Error('An unknown error occurred');
  }
};

const logRequestsMw = morgan('tiny');

module.exports = {
  handleDbErrorMw,
  logRequestsMw,
};
