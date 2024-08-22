const router = require('express').Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

const {User} = require('../models/user');
const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(32).required(),
});

router.post('/', async (request, response) => {
  const {error, value} = userSchema.validate(request.body);
  if (error) return response.status(400).json({errors: error.details.map(error => error.message)});
  
  let user = await User.findOne({email: value.email});
  if (!user) return response.status(400).json({errors: ['Invalid email or password.']});
  
  const validPassword = await bcrypt.compare(value.password, user.password);
  if (!validPassword) return response.status(400).json({errors: ['Invalid email or password.']});
  
  return response.status(201).json(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;