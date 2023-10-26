const Joi = require('joi');
const handleJoiError = require('../../utils/joiErrorHandler');

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required().label('Username'),
    email: Joi.string().email().required().label('Email'),
    firstName: Joi.string().required().label('First Name'),
    lastName: Joi.string().required().label('Last Name'),
    avatar: Joi.string().label('Avatar').optional(),
    password: Joi.string().min(6).required().label('Password'),
    isAdmin: Joi.boolean().label('Admin access').optional(),
    createdAt: Joi.date().default(Date.now).label('Creation Date'),
    updatedAt: Joi.date().default(Date.now).label('Last Update'),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    handleJoiError(error);
  }
  next();
};

module.exports = validateUser;
