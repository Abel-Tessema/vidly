const mongoose = require('mongoose');
const Joi = require('joi');

const {genreSchemaMongoose} = require('./genre');

const movieSchema = Joi.object({
  title: Joi.string().required().min(3).max(255).trim(),
  genreId: Joi.string().length(24).required(),
  numberInStock: Joi.number().required().integer().min(0).max(255).default(0),
  dailyRentalRate: Joi.number().required().min(0).max(255).default(0)
});

const movieSchemaMongoose = new mongoose.Schema({
  title: {type: String, required: true, minlength: 3, maxlength: 255, trim: true},
  genre: {type: genreSchemaMongoose, required: true},
  numberInStock: {type: Number, required: true, min: 0, max: 255, default: 0},
  dailyRentalRate: {type: Number, required: true, min: 0, max: 255, default: 0}
});

const Movie = mongoose.model('Movie', movieSchemaMongoose);

module.exports.movieSchema = movieSchema;
module.exports.Movie = Movie;