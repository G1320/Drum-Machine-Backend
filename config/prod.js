require('dotenv').config();
let config;

if (process.env.NODE_ENV === 'production') {
  config = require('./prod');
} else {
  console.log(process.env.DB_URL);

  config = require('./dev');
  console.log('config', config);
}
config.isGuestMode = true;

module.exports = config;
