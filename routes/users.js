const router = require('express').Router();

const {userSchema, User} = require('../models/user');

router.post('', async (request, response) => {
  const {error, value} = userSchema.validate(request.body);
  if (error) return response.status(400).json({errors: error.details.map(error => error.message)});
  
  let user = await User.findOne({email: value.email});
  if (user) return response.status(400).json({errors: ['There\'s already a user registered with that email.']});
  
  user = new User({
    name: value.name,
    email: value.email,
    password: value.password
  });
  
  const result = await user.save();
  return response.status(201).json(result);
});

module.exports = router;