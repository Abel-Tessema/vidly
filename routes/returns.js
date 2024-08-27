const {Rental} = require("../models/rental");
const router = require('express').Router();

router.post('/', async (request, response) => {
  if (!request.body.customerId)
    return response.status(400).json({errors: ['The field \'customerId\' is required.']});

  if (!request.body.movieId)
    return response.status(400).json({errors: ['The field \'movieId\' is required.']});
  
  const rental = await Rental.findOne({
    'customer._id': request.body.customerId,
    'movie._id': request.body.movieId
  });
  
  if (!rental)
    return response.status(404).json({errors: ['There is no rental with the provided customerId and movieId.']});
  
  if (rental.dateReturned)
    return response.status(400).json({errors: ['The return of the rental has already been processed.']});
  
  return response.status(401).json({errors: ['You are unauthorized.']});
});

module.exports = router;