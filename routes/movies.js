const router = require('express').Router();

const {movieSchema, Movie} = require('../models/movie');
const {Genre} = require('../models/genre');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (request, response) => {
  const movies = await Movie.find().sort('name');
  return response.json(movies);
});

router.get('/:id', validateObjectId, async (request, response) => {
  const movie = await Movie.findById(request.params.id);
  if (!movie) return response.status(404).json({errors: ['There is no movie with that id number.']});
  return response.json(movie);
});

router.post('/', async (request, response) => {
  const {error, value} = movieSchema.validate(request.body);
  if (error) return response.status(400).json({errors: error.details.map(error => error.message)});
  
  const genre = await Genre.findById(value.genreId);
  if (!genre) return response.status(404).json({errors: ['There is no genre with that id number.']});
  
  const movie = new Movie({
    title: value.title,
    genre: {_id: genre._id, name: genre.name},
    numberInStock: value.numberInStock,
    dailyRentalRate: value.dailyRentalRate
  });
  
  const result = await movie.save();
  return response.status(201).json(result);
});

router.put('/:id', validateObjectId, async (request, response) => {
  const {error, value} = movieSchema.validate(request.body);
  let {errors} = {errors: []};
  if (error) {
    for (let i = 0; i < error.details.length; i++)
      errors.push(error.details[i].message);
    return response.status(400).json(errors);
  }
  
  const genre = await Genre.findById(value.genreId);
  if (!genre) return response.status(404).json({errors: ['There is no genre with that id number.']});
  
  try {
    const movie = await Movie.findByIdAndUpdate(
      request.params.id,
      {
        title: value.title,
        genre: {_id: genre._id, name: genre.name},
        numberInStock: value.numberInStock,
        dailyRentalRate: value.dailyRentalRate
      },
      {new: true}
    );
    if (!movie) return response.status(404).json({errors: ['There is no movie with that id number.']});
    
    return response.json(movie);
  } catch (e) {
    return response.status(404).json({errors: ['There is no movie with that id number.']});
  }
});

router.delete('/:id', validateObjectId, async (request, response) => {
  const movie = await Movie.findByIdAndDelete(request.params.id);
  if (!movie) return response.status(404).json({errors: ['There is no movie with that id number.']});
  return response.json(movie);
});

module.exports = router;