const mongoose = require('mongoose');

function validateObjectId(request, response, next) {
  if (!mongoose.isValidObjectId(request.params.id))
    return response.status(404).json({errors: ['You have supplied an invalid id.']});
  
  next();
}

module.exports = validateObjectId;