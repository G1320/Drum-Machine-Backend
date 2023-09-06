const Morgan = require('morgan');
const Joi = require('joi');
const ExpressError = require('../utils/expressError');

const validatePageName = (req, res, next) => {
  const schema = Joi.object({
    pageName: Joi.string().alphanum().min(2).max(30).required().label('The requested page name'),
  });
  const { error } = schema.validate(req.params);
  if (error) {
    const msg = error.details
      .map((el) => el.message)
      .join(',')
      .replace(/"/g, '');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required().label('Username'),
    email: Joi.string().email().required().label('Email'),
    firstName: Joi.string().required().label('First Name'),
    lastName: Joi.string().required().label('Last Name'),
    avatar: Joi.string().label('Avatar'), //Add .url when ready
    password: Joi.string().min(6).required().label('Password'),
    // .external(async (value) => {}),
    role: Joi.string().valid('user', 'admin').default('user').label('Role'),
    createdAt: Joi.date().default(Date.now).label('Creation Date'),
    updatedAt: Joi.date().default(Date.now).label('Last Update'),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    const msg = error.details
      .map((el) => el.message)
      .join(',')
      .replace(/"/g, '');
    throw new ExpressError(msg, 400);
  }

  next();
};

const validateKit = (req, res, next) => {
  const soundSchema = Joi.object({});

  const schema = Joi.object({
    name: Joi.string().required().label('Kit name'),
    subscribers: Joi.number().required().label('Number of subscribers'),
    description: Joi.string().required().label('Kit description'),
    sounds: Joi.array().items(soundSchema).label('Sounds array'),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    const msg = error.details
      .map((el) => el.message)
      .join(',')
      .replace(/"/g, '');
    throw new ExpressError(msg, 400);
  }
  next();
};

const handleDbErrorMw = (err, req, res, next) => {
  if (['CastError', 'ValidationError', 'DisconnectedError', 'MongoError'].includes(err.name)) {
    err = new ExpressError(handleDbErrorMsg(err), 400);
  }
  console.error(err.stack);
  next(err);
};

const handleDbErrorMsg = (error) => {
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
  console.error(message);
  res.status(statusCode || 500).send(message || 'Something went wrong!');
};

const logRequestsMw = Morgan('tiny');

module.exports = {
  handleDbErrorMw,
  logRequestsMw,
  handleErrorMw,
  validatePageName,
  validateKit,
  validateUser,
};
