const router = require('express').Router();

const Joi = require("joi");

const genreSchema = Joi.object({
  name: Joi.string().min(3).required(),
});

const genres = [
  {id: 1, name: 'Action'},
  {id: 2, name: 'Comedy'},
  {id: 3, name: 'Drama'},
];

router.get('/', (request, response) => {
  return response.json(genres);
});

router.get('/:id', (request, response) => {
  const genre = genres.find(genre => genre.id === parseInt(request.params.id));
  if (!genre) return response.status(404).json({errors: ['There is no genre with that id number.']});
  return response.json(genre);
});

router.post('/', (request, response) => {
  const {error, value} = genreSchema.validate(request.body);
  let {errors} = {errors: []};
  if (error) {
    for (let i = 0; i < error.details.length; i++)
      errors.push(error.details[i].message);
    return response.status(400).json({errors});
  }
  const genre = {id: genres.length + 1, ...value};
  genres.push(genre);
  return response.status(201).json(genre);
});

router.put('/:id', (request, response) => {
  const genre = genres.find(genre => genre.id === parseInt(request.params.id));
  if (!genre) return response.status(404).json({errors: ['There is no genre with that id number.']});
  
  const {error, value} = genreSchema.validate(request.body);
  let {errors} = {errors: []};
  if (error) {
    for (let i = 0; i < error.details.length; i++)
      errors.push(error.details[i].message);
    return response.status(400).json(errors);
  }
  
  Object.assign(genre, {...genre, ...value});
  return response.json(genre);
});

router.delete('/:id', (request, response) => {
  const genre = genres.find(genre => genre.id === parseInt(request.params.id));
  if (!genre) return response.status(404).json({errors: ['There is no genre with that id number.']});
  
  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  return response.json(genre);
});

module.exports = router;