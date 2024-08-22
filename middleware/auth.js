const jwt = require('jsonwebtoken');
const config = require('config');

function auth(request, response, next) {
  const token = request.header('x-auth-token');
  if (!token) return response.status(401).json({errors: ['Access denied. No token has been provided.']});
  
  try {
    request.user = jwt.verify(token, config.get('jwtSecretKey')); // Decode the information using the secret key
    next();
  } catch (e) {
    return response.status(400).json({errors: ['The token is invalid.']});
  }
}

module.exports = auth;