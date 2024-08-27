const router = require('express').Router();

router.post('/', (request, response) => {
  response.status(401).json({errors: ['You are unauthorized.']});
});

module.exports = router;