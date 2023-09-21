const crypto = require('crypto');

function generateSecretKey(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

console.log(generateSecretKey());
