const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = Joi.object({
  name: Joi.string().required().min(3).max(255).trim(),
  isGold: Joi.bool().default(false),
  phone: Joi.string().min(8).required()
});

const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: {type: String, required: true, minlength: 3, maxlength: 255, trim: true},
  isGold: {type: Boolean, required: true, default: false},
  phone: {type: String, required: true}
}));

module.exports.customerSchema = customerSchema;
module.exports.Customer = Customer;