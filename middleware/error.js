const winston = require('winston');

function error(error, request, response, next) {
  winston.error(error.message, error);
  return response.status(500).json({errors: ['Something went wrong.']});
}

module.exports = error;