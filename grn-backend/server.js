const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle form submission
app.post('/submit-form', (req, res) => {
  const formData = req.body;
  // Here you can save the form data to your database or perform any other actions
  console.log('Received form data:', formData);
  
  // Send a response back to the client
  res.status(200).send({ message: 'Form data received successfully!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
