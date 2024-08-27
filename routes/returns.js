const {Rental} = require("../models/rental");
const router = require('express').Router();
const auth = require('../middleware/auth');
const {Movie} = require("../models/movie");
const {returnSchema} = require('../models/return');
const validate = require('../middleware/validate');

router.post('/', auth, validate(returnSchema), async (request, response) => {
  const rental = await Rental.lookup(request.value.customerId, request.value.movieId);
  
  if (!rental)
    return response.status(404).json({errors: ['There is no rental with the provided customerId and movieId.']});
  
  if (rental.dateReturned)
    return response.status(400).json({errors: ['The return of the rental has already been processed.']});
  
  rental.return();
  await rental.save();
  
  const movie = await Movie.findById(request.body.movieId);
  movie.numberInStock++;
  await movie.save();
  
  return response.status(201).json(rental);
});

module.exports = router;