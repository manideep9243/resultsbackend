// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// const { MongoClient } = require('mongodb'); 

// const app = express();
// const PORT = 3000; 

// const dbUri = 'mongodb+srv://22wj1a6673:avinash00725@cluster0.vecxz.mongodb.net/Results?retryWrites=true&w=majority&appName=Cluster0';
// const dbName = 'Results'; 
// const collectionName = 'StudentResults'; 

// // Middleware
// app.use(cors()); // Allow cross-origin requests
// app.use(express.json()); // Parse JSON in requests

// // MongoDB Client
// let dbClient;

// // Connect to MongoDB
// async function connectMongo() {
//   try {
//     dbClient = await MongoClient.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   }
// }

// connectMongo();

// // Serve static files for the frontend (optional)
// app.use(express.static(path.join(__dirname, 'frontend')));

// // Endpoint to fetch all results
// app.get('/api/data', async (req, res) => {
//   try {
//     const db = dbClient.db(dbName); // Access the database
//     const collection = db.collection(collectionName); // Access the collection
//     // Fetch all documents from the collection
//     const results = await collection.find().toArray();
//     // console.log("Fetched results:", results); // Log the results

//     if (results.length === 0) {
//       return res.status(404).send('No results found');
//     }

//     res.json(results); // Send all results as JSON
//   } catch (error) {
//     console.error('Error fetching data from MongoDB:', error.message);
//     res.status(500).send('Could not fetch data from the database');
//   }
// });

// // Endpoint to fetch a specific result by roll number
// app.post('/getResults', async (req, res) => {
//   const { rollNumber } = req.body;

//   // Validate input
//   if (!rollNumber) {
//     return res.status(400).send('Roll Number is required');
//   }

//   try {
//     const db = dbClient.db(dbName);
//     const collection = db.collection(collectionName);

//     // Log the roll number being queried
//     console.log('Querying for roll number:', rollNumber);

//     // Find the result matching the roll number
//     const result = await collection.findOne({ rollNumber });

//     // Log the result found
//     console.log('Result found:', result);

//     if (!result) {
//       return res.status(404).send('Result not found for the given Roll Number');
//     }

//     res.json(result); // Send the matched result as JSON
//   } catch (error) {
//     console.error('Error fetching result by roll number:', error.message);
//     res.status(500).send('Could not fetch the result');
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB setup
const dbUri = 'mongodb+srv://gniresults:gni1234@cluster0.iqgr5ty.mongodb.net/Results?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'Results';
const collectionName = 'StudentResults';

let dbClient;

// Connect to MongoDB
async function connectMongo() {
  try {
    dbClient = await MongoClient.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
connectMongo();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// Rate limiter (optional but good practice)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// GET all student results
app.get('/api/data', async (req, res) => {
  try {
    const db = dbClient.db(dbName);
    const collection = db.collection(collectionName);
    const results = await collection.find().toArray();

    res.json(results || []);
  } catch (error) {
    console.error('Error fetching all data:', error.message);
    res.status(500).json([]);
  }
});

// POST: Get result by roll number
app.post('/getResults', async (req, res) => {
  const { rollNumber } = req.body;

  if (!rollNumber) {
    return res.status(400).send('Roll Number is required');
  }

  try {
    const db = dbClient.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.findOne({ rollNumber });

    if (!result) {
      return res.status(404).send('Result not found for the given Roll Number');
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching result by roll number:', error.message);
    res.status(500).send('Server error while fetching result');
  }
});

// Fallback route (optional)
app.get('*', (req, res) => {
  res.status(404).send('Route not found');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

