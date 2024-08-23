
function error(error, request, response) {
  // Log the exception.
  return response.status(500).json({errors: ['Something went wrong.']});
}

module.exports = error;