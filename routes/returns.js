const {Rental} = require("../models/rental");
const router = require('express').Router();
const auth = require('../middleware/auth');
const {Movie} = require("../models/movie");

router.post('/', auth, async (request, response) => {
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
  
  rental.dateReturned = new Date();
  const millisecondsInADay = 1_000 * 60 * 60 * 24;
  const rentalDays = (rental.dateReturned - rental.dateOut) / millisecondsInADay;
  rental.rentalFee = rental.movie.dailyRentalRate * rentalDays;
  await rental.save();
  
  const movie = await Movie.findById(request.body.movieId);
  movie.numberInStock++;
  await movie.save();
  
  return response.status(201).json(rental);
});

module.exports = router;