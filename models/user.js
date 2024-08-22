const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(4).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(255).required(),
});

const userSchemaMongoose = new mongoose.Schema({
  name: {type: String, minlength: 4, maxlength: 50, trim: true, required: true},
  email: {type: String, minlength: 5, maxlength: 255, unique: true, trim: true, required: true},
  password: {type: String, minlength: 4, maxlength: 1_024, trim: true, required: true},
});

const User = mongoose.model('User', userSchemaMongoose);

module.exports.userSchema = userSchema;
module.exports.User = User;