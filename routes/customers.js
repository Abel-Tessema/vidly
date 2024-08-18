const router = require('express').Router();

const {customerSchema, Customer} = require('../models/customer');

router.get('/', async (request, response) => {
  const customers = await Customer.find().sort('name');
  return response.json(customers);
});

router.get('/:id', async (request, response) => {
  const customer = await Customer.findById(request.params.id);
  if (!customer) return response.status(404).json({errors: ['There is no customer with that id number.']});
  return response.json(customer);
});

router.post('/', async (request, response) => {
  const {error, value} = customerSchema.validate(request.body);
  let {errors} = {errors: []};
  if (error) {
    for (let i = 0; i < error.details.length; i++)
      errors.push(error.details[i].message);
    return response.status(400).json({errors});
  }
  const customer = new Customer({...value});
  const result = await customer.save();
  return response.status(201).json(result);
});

router.put('/:id', async (request, response) => {
  const {error, value} = customerSchema.validate(request.body);
  let {errors} = {errors: []};
  if (error) {
    for (let i = 0; i < error.details.length; i++)
      errors.push(error.details[i].message);
    return response.status(400).json(errors);
  }
  
  try {
    const customer = await Customer.findByIdAndUpdate(request.params.id, {...value}, {new: true});
    if (!customer) return response.status(404).json({errors: ['There is no customer with that id number.']});
    
    return response.json(customer);
  } catch (e) {
    return response.status(404).json({errors: ['There is no customer with that id number.']});
  }
});

router.delete('/:id', async (request, response) => {
  const customer = await Customer.findByIdAndDelete(request.params.id);
  if (!customer) return response.status(404).json({errors: ['There is no customer with that id number.']});
  return response.json(customer);
});

module.exports = router;