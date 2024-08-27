const router = require('express').Router();

router.post('/', (request, response) => {
  if (!request.body.customerId)
    return response.status(400).json({errors: ['The field \'customerId\' is required.']});

  if (!request.body.movieId)
    return response.status(400).json({errors: ['The field \'movieId\' is required.']});
  
  return response.status(401).json({errors: ['You are unauthorized.']});
});

module.exports = router;