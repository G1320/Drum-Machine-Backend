const { JWT_REFRESH_KEY, JWT_SECRET_KEY } = require('../../config/config');
const jwt = require('jsonwebtoken');
const ExpressError = require('../../utils/expressError');

function verifyTokenMw(req, res, next) {
  const token = req.signedCookies.refreshToken || req.signedCookies.authToken;

  if (!token) throw new ExpressError('Access denied. No token provided.', 401);
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_KEY || JWT_SECRET_KEY);
    req.decodedJwt = decoded;
    next();
  } catch (error) {
    throw new ExpressError('invalid token', 400);
  }
}

module.exports = verifyTokenMw;
