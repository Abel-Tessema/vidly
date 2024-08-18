const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = Joi.object({
  name: Joi.string().min(3).required(),
});

const Genre = mongoose.model('Genre', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 32,
    trim: true,
    validate: {
      validator: function(value) {
        return (value) && (value.length >= 3) && (value.length <= 32);
      },
      message: 'A genre needs a name that is 3 to 32 characters long.'
    }
  }
}));

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;