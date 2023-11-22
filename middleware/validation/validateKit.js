const Joi = require('joi');
const handleJoiError = require('../../utils/joiErrorHandler');

const validateKit = (req, res, next) => {
  const soundSchema = Joi.object({
    _id: Joi.string().optional(),
    keyCode: Joi.string().optional().label('Sound Title'),
    title: Joi.string().optional().label('Sound Title'),
    src: Joi.string().optional().label('Sound Url'),
    img: Joi.string().optional().label('Sound Image URL'),
    createdAt: Joi.date().default(Date.now).label('Creation Date'),
    updatedAt: Joi.date().default(Date.now).label('Last Update'),
    idx: Joi.number().optional(),
  });

  const schema = Joi.object({
    _id: Joi.string().optional(),
    name: Joi.string().alphanum().min(2).max(10).required().label('Kit name'),
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

module.exports = validateKit;
