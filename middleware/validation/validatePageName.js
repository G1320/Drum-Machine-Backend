const Joi = require('joi');
const handleJoiError = require('../../utils/joiErrorHandler');

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

module.exports = validatePageName;
