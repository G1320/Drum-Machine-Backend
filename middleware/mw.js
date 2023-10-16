const Morgan = require('morgan');
const Joi = require('joi');
const ExpressError = require('../utils/expressError');
const handleJoiError = require('../utils/joiErrorHandler');
const { handleDbErrorMsg } = require('../utils/handleDbErrorMsg');

const validatePageName = (req, res, next) => {
  const schema = Joi.object({
    pageName: Joi.string().alphanum().min(2).max(30).required().label('The requested page name'),
  });
  const { error } = schema.validate(req.params);
  if (error) {
    handleJoiError(error);
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
    avatar: Joi.string().label('Avatar').optional(),
    password: Joi.string().min(6).required().label('Password'),
    isAdmin: Joi.boolean().label('Admin access').optional(),
    // role: Joi.string().valid('user', 'admin').default('user').label('Role'),
    createdAt: Joi.date().default(Date.now).label('Creation Date'),
    updatedAt: Joi.date().default(Date.now).label('Last Update'),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    handleJoiError(error);
  }
  next();
};

const validateKit = (req, res, next) => {
  const soundSchema = Joi.object({
    _id: Joi.string().optional(),
    title: Joi.string().optional().label('Sound Title'),
    author: Joi.string().optional().label('Sound Author'),
    img: Joi.string().optional().label('Sound Image URL'),
  });

  const schema = Joi.object({
    _id: Joi.string().optional(),
    name: Joi.string().alphanum().min(2).max(30).required().label('Kit name'),
    subscribers: Joi.number().optional().label('Number of subscribers'),
    description: Joi.string().required().label('Kit description'),
    sounds: Joi.array().items(soundSchema).optional().label('Sounds array'),
    __v: Joi.number().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    handleJoiError(error);
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
