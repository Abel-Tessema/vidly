const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const jwt = require("jsonwebtoken");
const config = require("config");

const complexityOptions = {
  min: 4,
  max: 32,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

const userSchema = Joi.object({
  name: Joi.string().min(4).max(50).required(),
  email: Joi.string().email().required(),
  password: passwordComplexity(complexityOptions).required(),
});

const userSchemaMongoose = new mongoose.Schema({
  name: {type: String, minlength: 4, maxlength: 50, trim: true, required: true},
  email: {type: String, minlength: 5, maxlength: 255, unique: true, trim: true, required: true},
  password: {type: String, minlength: 4, maxlength: 1_024, trim: true, required: true},
});

userSchemaMongoose.methods.generateAuthToken = function () {
  return jwt.sign({_id: this._id}, config.get('jwtSecretKey'));
}

const User = mongoose.model('User', userSchemaMongoose);

module.exports.userSchema = userSchema;
module.exports.User = User;