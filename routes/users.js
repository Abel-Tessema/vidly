const router = require('express').Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

const {userSchema, User} = require('../models/user');
const auth = require('../middleware/auth');

router.get('/profile', auth, async (request, response) => {
  const user = await User.findById(request.user._id).select('-password');
  return response.json(user);
});

router.post('/', async (request, response) => {
  const {error, value} = userSchema.validate(request.body);
  if (error) return response.status(400).json({errors: error.details.map(error => error.message)});
  
  let user = await User.findOne({email: value.email});
  if (user) return response.status(400).json({errors: ['There\'s already a user registered with that email.']});
  
  user = new User(_.pick(value, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  
  const result = await user.save();
  
  const token = user.generateAuthToken();
  return response
    .status(201)
    .header('x-auth-token', token)
    .json(_.pick(result, ['_id', 'name', 'email']));
});

module.exports = router;