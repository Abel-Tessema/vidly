const router = require('express').Router();

const {genreSchema, Genre} = require('../models/genre');

router.get('/', async (request, response) => {
  const genres = await Genre.find().sort('name');
  return response.json(genres);
});

router.get('/:id', async (request, response) => {
  const genre = await Genre.findById(request.params.id);
  if (!genre) return response.status(404).json({errors: ['There is no genre with that id number.']});
  return response.json(genre);
});

router.post('/', async (request, response) => {
  const {error, value} = genreSchema.validate(request.body);
  let {errors} = {errors: []};
  if (error) {
    for (let i = 0; i < error.details.length; i++)
      errors.push(error.details[i].message);
    return response.status(400).json({errors});
  }
  const genre = new Genre({...value});
  const result = await genre.save();
  return response.status(201).json(result);
});

router.put('/:id', async (request, response) => {
  const {error, value} = genreSchema.validate(request.body);
  let {errors} = {errors: []};
  if (error) {
    for (let i = 0; i < error.details.length; i++)
      errors.push(error.details[i].message);
    return response.status(400).json(errors);
  }
  
  try {
    const genre = await Genre.findByIdAndUpdate(request.params.id, {...value}, {new: true});
    if (!genre) return response.status(404).json({errors: ['There is no genre with that id number.']});
    
    return response.json(genre);
  } catch (e) {
    return response.status(404).json({errors: ['There is no genre with that id number.']});
  }
});

router.delete('/:id', async (request, response) => {
  const genre = await Genre.findByIdAndDelete(request.params.id);
  if (!genre) return response.status(404).json({errors: ['There is no genre with that id number.']});
  return response.json(genre);
});

module.exports = router;