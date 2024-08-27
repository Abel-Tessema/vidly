
function validate(schema) {
  return (request, response, next) => {
    const {error, value} = schema.validate(request.body);
    if (error) return response.status(400).json({errors: error.details.map(error => error.message)});
    
    request.value = value;
    next();
  }
}

module.exports = validate;