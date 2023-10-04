const jwt = require('jsonwebtoken');
const ExpressError = require('../utils/expressError');

function authMw(req, res, next) {
  const token = req.signedCookies.authToken;
  // const loggedinUser = req.query.loggedinUser || req.params.loggedinUser;

  // const loggedinUser =
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];
  if (!token) throw new ExpressError('Access denied. No token provided.', 401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.decodedJwt = decoded;
    // req.loggedinUser = loggedinUser;
    next();
  } catch (error) {
    throw new ExpressError('invalid token', 400);
  }
}

module.exports = authMw;
