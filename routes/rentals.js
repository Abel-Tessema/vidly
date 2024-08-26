const router = require('express').Router();

const {rentalSchema, Rental} = require('../models/rental');
const {Movie} = require("../models/movie");
const {Customer} = require("../models/customer");
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (request, response) => {
  const rentals = await Rental.find().sort('-dateOut');
  return response.json(rentals);
});

router.get('/:id', validateObjectId,  async (request, response) => {
  const rental = await Rental.findById(request.params.id);
  if (!rental) return response.status(404).json({errors: ['There is no rental with that id number.']});
  return response.json(rental);
});

router.post('/', async (request, response) => {
  try {
    const {error, value} = rentalSchema.validate(request.body);
    if (error) return response.status(400).json({errors: error.details.map(error => error.message)});
  
    const customer = await Customer.findById(value.customerId);
    if (!customer) return response.status(404).json({errors: ['There is no customer with that id.']});
    
    const movie = await Movie.findById(value.movieId);
    if (!movie) return response.status(404).json({errors: ['There is no movie with that id.']});
    
    if (movie.numberInStock === 0) return response.status(400).json({errors: ['The movie is not in stock.']});
    
    const rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      }
    });
    
    const result = await rental.save();
    movie.numberInStock--;
    await movie.save();
    
    return response.status(201).json(result);
  } catch (e) {
    console.log(e);
    return response.status(500).json({errors: ['Something went wrong.']});
  }
});

router.put('/:id', validateObjectId, async (request, response) => {
  const rental = await Rental.findById(request.params.id);
  if (!rental) return response.status(404).json({errors: ['There is no rental with that id.']});
  
  const {error, value} = rentalSchema.validate(request.body);
  if (error) return response.status(400).json({errors: error.details.map(error => error.message)});
  
  const customer = await Customer.findById(value.customerId);
  if (!customer) return response.status(404).json({errors: ['There is no customer with that id.']});
  
  const movie = await Movie.findById(value.movieId);
  if (!movie) return response.status(404).json({errors: ['There is no movie with that id.']});
  
  const oldMovie = await Movie.findById(rental.movie._id);
  oldMovie.numberInStock++;
  await oldMovie.save();
  
  rental.set({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  
  movie.numberInStock--;
  await movie.save();
  
  const result = await rental.save();
  return response.json(result);
});

router.delete('/:id', validateObjectId, async (request, response) => {
  const rental = await Rental.findByIdAndDelete(request.params.id);
  if (!rental) return response.status(404).json({errors: ['There is no rental with that id.']});
  return response.json(rental);
});

module.exports = router;