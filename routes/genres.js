const router = require('express').Router();

const {genreSchema, Genre} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');

router.get('/', asyncMiddleware(async (request, response) => {
  const genres = await Genre.find().sort('name');
  return response.json(genres);
}));

router.get('/:id', asyncMiddleware(async (request, response) => {
  const genre = await Genre.findById(request.params.id);
  if (!genre) return response.status(404).json({errors: ['There is no genre with that id number.']});
  return response.json(genre);
}));

router.post('/', auth, asyncMiddleware(async (request, response) => {
  const {error, value} = genreSchema.validate(request.body);
  if (error) return response.status(400).json({errors: error.details.map(error => error.message)});
  
  const genre = new Genre({...value});
  const result = await genre.save();
  return response.status(201).json(result);
}));

router.put('/:id', auth, asyncMiddleware(async (request, response) => {
  const {error, value} = genreSchema.validate(request.body);
  if (error) return response.status(400).json({errors: error.details.map(error => error.message)});
  
  try {
    const genre = await Genre.findByIdAndUpdate(request.params.id, {...value}, {new: true});
    if (!genre) return response.status(404).json({errors: ['There is no genre with that id number.']});
    
    return response.json(genre);
  } catch (e) {
    return response.status(404).json({errors: ['There is no genre with that id number.']});
  }
}));

router.delete('/:id', auth, admin, asyncMiddleware(async (request, response) => {
  const genre = await Genre.findByIdAndDelete(request.params.id);
  if (!genre) return response.status(404).json({errors: ['There is no genre with that id number.']});
  return response.json(genre);
}));

module.exports = router;