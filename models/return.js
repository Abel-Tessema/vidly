const Joi = require("joi");

const returnSchemaJoi = Joi.object({
  customerId: Joi.objectId().required(),
  movieId: Joi.objectId().required(),
});

module.exports.returnSchema = returnSchemaJoi;