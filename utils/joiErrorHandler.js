const ExpressError = require('./expressError');

const handleJoiError = (error) => {
    if (!error) return null;
    const msg = error.details
        .map((el) => el.message)
        .join(',')
        .replace(/"/g, '');
    throw new ExpressError(msg, 400);
};

module.exports = handleJoiError;