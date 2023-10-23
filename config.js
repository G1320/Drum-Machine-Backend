require('dotenv').config();

const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(',');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = {
  PORT,
  ALLOWED_ORIGINS,
  JWT_SECRET_KEY,
};
