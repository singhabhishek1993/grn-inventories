const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi'); 
const app = express();
const port = 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Joi schema for form data validation
const formDataSchema = Joi.object({
  company: Joi.string().required(),
  date: Joi.date().iso().required(),
  store: Joi.string().required(),
  remarks: Joi.string(),
  inventories: Joi.array().items(Joi.object({
    itemCategory: Joi.string().required(),
    item: Joi.string().required(),
    strain: Joi.string().required(),
    quantity: Joi.string().pattern(/^\d+$/).required(), 
    uom: Joi.string().required(),
    totalCost: Joi.number().required(),
    costPerUnit: Joi.number(),
    supplier: Joi.string().required()
  })).required()
});

// Endpoint to handle form submission
app.post('/submit-form', (req, res) => {
  const formData = req.body;
  
  // Validate form data using Joi schema
  const { error } = formDataSchema.validate(formData);
  if (error) {
    // If validation fails, send a 400 Bad Request response with the validation error message
    return res.status(400).send({ message: error.details[0].message });
  }

  // If validation passes, you can proceed with saving the form data or performing other actions
  console.log('Received form data:', formData);
  
  // Send a response back to the client
  res.status(200).send({ message: 'Form data received successfully!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
