const config = require('config');

function configuration() {
  if (!config.get('jwtSecretKey')) {
    throw new Error('FATAL ERROR: jwtSecretKey is not defined.');
  }
}

module.exports = configuration;