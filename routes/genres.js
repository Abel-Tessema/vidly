const router = require('express').Router();

const {genreSchema, Genre} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (request, response) => {
  const genres = await Genre.find().sort('name');
  return response.json(genres);
});

router.get('/:id', validateObjectId, async (request, response) => {
  const genre = await Genre.findById(request.params.id);
  if (!genre) return response.status(404).json({errors: ['There is no genre with that id.']});
  return response.json(genre);
});

router.post('/', auth, async (request, response) => {
  const {error, value} = genreSchema.validate(request.body);
  if (error) return response.status(400).json({errors: error.details.map(error => error.message)});
  
  const genre = new Genre({...value});
  const result = await genre.save();
  return response.status(201).json(result);
});

router.put('/:id', auth, validateObjectId, async (request, response) => {
  const {error, value} = genreSchema.validate(request.body);
  if (error) return response.status(400).json({errors: error.details.map(error => error.message)});
  
  try {
    const genre = await Genre.findByIdAndUpdate(request.params.id, {...value}, {new: true});
    if (!genre) return response.status(404).json({errors: ['There is no genre with that id.']});
    
    return response.json(genre);
  } catch (e) {
    return response.status(404).json({errors: ['There is no genre with that id.']});
  }
});

router.delete('/:id', auth, validateObjectId, admin, async (request, response) => {
  const genre = await Genre.findByIdAndDelete(request.params.id);
  if (!genre) return response.status(404).json({errors: ['There is no genre with that id.']});
  return response.json(genre);
});

module.exports = router;