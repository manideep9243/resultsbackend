const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON in requests

// API Endpoint to fetch JSON data
app.get('/api/data', (req, res) => {
  const resultsFilePath = path.join(__dirname, 'data', 'results.json');
  
  try {
    const jsonData = fs.readFileSync(resultsFilePath, 'utf-8');
    res.json(JSON.parse(jsonData)); // Send JSON to the frontend
  } catch (error) {
    console.error('Error reading JSON file:', error);
    res.status(500).send('Could not read data');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});




// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const port = 3000;

// // Use CORS middleware to allow requests from other domains
// app.use(cors());

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Serve static files (e.g., for frontend)
// app.use(express.static(path.join(__dirname, 'frontend')));

// // Endpoint to get the results
// app.post('/getResults', (req, res) => {
//   const { rollNumber } = req.body;

//   // Check if rollNumber is provided
//   if (!rollNumber) {
//     return res.status(400).send('Roll Number is required');
//   }

//   // Path to the results JSON file
//   const resultsFilePath = path.join(__dirname, 'data/results.json');

//   // Read the results file
//   fs.readFile(resultsFilePath, 'utf8', (err, data) => {
//     if (err) {
//       return res.status(500).send('Error reading the results file');
//     }

//     try {
//       // Parse the JSON data
//       const results = JSON.parse(data);

//       // Find the result by roll number
//       const result = results.find(r => r.rollNumber === rollNumber);

//       // If result not found, send a not found error
//       if (!result) {
//         return res.status(404).send('Result not found for the given Roll Number');
//       }

//       // Send the found result back as JSON
//       res.json(result);
//     } catch (parseError) {
//       return res.status(500).send('Error parsing the JSON data');
//     }
//   });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
