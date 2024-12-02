const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000; // Change if needed

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON in requests

// Serve static files for the frontend (optional)
app.use(express.static(path.join(__dirname, 'frontend')));

// Endpoint to fetch all results
app.get('/api/data', (req, res) => {
  const resultsFilePath = path.join(__dirname, 'data', 'results.json');

  try {
    const jsonData = fs.readFileSync(resultsFilePath, 'utf-8');
    res.json(JSON.parse(jsonData)); // Send all results as JSON
  } catch (error) {
    console.error('Error reading JSON file:', error.message);
    res.status(500).send('Could not read data');
  }
});

// Endpoint to fetch a specific result by roll number
app.post('/getResults', (req, res) => {
  const { rollNumber } = req.body;

  // Validate input
  if (!rollNumber) {
    return res.status(400).send('Roll Number is required');
  }

  const resultsFilePath = path.join(__dirname, 'data', 'results.json');

  try {
    const jsonData = fs.readFileSync(resultsFilePath, 'utf-8');
    const results = JSON.parse(jsonData);

    // Find the result matching the roll number
    const result = results.find(r => r.rollNumber === rollNumber);

    if (!result) {
      return res.status(404).send('Result not found for the given Roll Number');
    }

    res.json(result); // Send the matched result as JSON
  } catch (error) {
    console.error('Error processing JSON file:', error.message);
    res.status(500).send('Could not process the request');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


