const Joi = require("joi");
const mongoose = require("mongoose");

const rentalSchemaJoi = Joi.object({
  customerId: Joi.objectId().required(),
  movieId: Joi.objectId().required()
});

const rentalSchemaMongoose = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      _id: mongoose.Schema.Types.ObjectId,
      name: {type: String, required: true, minlength: 3, maxlength: 255, trim: true},
      isGold: {type: Boolean, required: true, default: false},
      phone: {type: String, required: true}
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      _id: mongoose.Schema.Types.ObjectId,
      title: {type: String, required: true, minlength: 3, maxlength: 255, trim: true},
      dailyRentalRate: {type: Number, required: true, min: 0, max: 255, default: 0}
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

rentalSchemaMongoose.statics.lookup = function(customerId, movieId) {
  return this.findOne({ // Here, `this` references the class. Yep, JS is crazy.
    'customer._id': customerId,
    'movie._id': movieId
  });
};

rentalSchemaMongoose.methods.return = function() {
  this.dateReturned = new Date(); // Here, `this` references the object.
  
  const millisecondsInADay = 1_000 * 60 * 60 * 24;
  const rentalDays = (this.dateReturned - this.dateOut) / millisecondsInADay;
  this.rentalFee = this.movie.dailyRentalRate * rentalDays;
}

const Rental = mongoose.model('Rental', rentalSchemaMongoose);

module.exports.rentalSchema = rentalSchemaJoi; // Joi, for validation
module.exports.rentalSchemaMongoose = rentalSchemaMongoose; // Mongoose, for embedding documents
module.exports.Rental = Rental;