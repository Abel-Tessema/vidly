const Joi = require('joi');

function validation() {
  Joi.preferences({abortEarly: false});
  Joi.objectId = require('joi-objectid')(Joi);
}

module.exports = validation;