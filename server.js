// Backend (Node.js)

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = ['https://heartfelt-sable-d9471d.netlify.app']; // Update with your Netlify URL
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use(bodyParser.json());

// Endpoint to log visitor info
app.post('/log-visitor', (req, res) => {
  const { name, ip, location, latitude, longitude } = req.body;
  const logEntry = `Name: ${name}, IP: ${ip}, Location: ${location}, Latitude: ${latitude}, Longitude: ${longitude}, Timestamp: ${new Date().toISOString()}`;

  // Append log to file
  fs.appendFile('visitors.log', logEntry + '\n', (err) => {
    if (err) {
      console.error('Error logging visitor info:', err);
      return res.status(500).send('Failed to log visitor info.');
    }
    console.log('Visitor info logged.');
    res.status(200).send('Visitor info logged.');
  });
});

// Endpoint to fetch logged visitor info
app.get('/get-visitors', (req, res) => {
  fs.readFile('visitors.log', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading log file:', err);
      return res.status(500).send('Failed to fetch visitor info.');
    }
    res.status(200).send(data);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Frontend HTML example for accessing location and submitting data

/* Deploy the following HTML to Netlify */

