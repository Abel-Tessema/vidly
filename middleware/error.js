const logger = require('../logger');

function error(error, request, response, next) {
  logger.error(error);
  return response.status(500).json({errors: ['Something went wrong.']});
}

module.exports = error;