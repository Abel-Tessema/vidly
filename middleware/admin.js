const jwt = require("jsonwebtoken");
const config = require("config");

function admin(request, response, next) {
  if (!request.user.isAdmin)
    return response.status(403).json({errors: ['Access denied. You don\'t have the necessary permissions.']});
  next();
}

module.exports = admin;