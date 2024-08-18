const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  isGold: Joi.bool().default(false),
  phone: Joi.string().min(8).required()
});

const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: {type: String, required: true, trim: true},
  isGold: {type: Boolean, required: true, default: false},
  phone: {type: String, required: true}
}));

module.exports.customerSchema = customerSchema;
module.exports.Customer = Customer;