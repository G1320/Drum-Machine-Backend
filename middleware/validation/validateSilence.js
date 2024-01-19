const Joi = require('joi');
const handleJoiError = require('../../utils/joiErrorHandler');

const validateSilence = (req, res, next) => {
  const schema = Joi.object({
    _id: Joi.string().required().label('ID'),
    title: Joi.string().required().label('Title'),
    src: Joi.string().required().label('Source URL'),
  });

  const { error } = schema.validate(req.body);
  error ? handleJoiError(error) : next();
};

module.exports = validateSilence;
