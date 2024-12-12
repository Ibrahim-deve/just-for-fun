// Backend (Node.js)

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
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

// Endpoint to fetch IP, geographical location, and coordinates for mapping
app.get('/get-ip-location', (req, res) => {
  fs.readFile('visitors.log', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading log file:', err);
      return res.status(500).send('Failed to fetch visitor info.');
    }

    const entries = data.split('\n').filter(entry => entry).map(entry => {
      const [namePart, ipPart, locationPart, latPart, lonPart] = entry.split(', ').map(part => part.split(': ')[1]);
      return { 
        name: namePart, 
        ip: ipPart, 
        location: locationPart, 
        latitude: latPart, 
        longitude: lonPart 
      };
    });

    res.status(200).json(entries);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Frontend HTML example for accessing location and submitting data

/* Add the following HTML to your frontend file:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Log Visitor Info</title>
</head>
<body>
  <h1>Log Your Info</h1>
  <form id="visitor-form">
    <label for="name">Enter Your Name:</label>
    <input type="text" id="name" name="name" required />
    <button type="submit">Submit</button>
  </form>

  <h2>Submitted Data</h2>
  <div id="result"></div>
  <button id="print-button">Print</button>

  <script>
    async function logVisitor(name, latitude, longitude) {
      try {
        // Fetch IP and location details
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();

        // Prepare data to send to the server
        const visitorInfo = {
          name: name,
          ip: data.query,
          location: `${data.city}, ${data.regionName}, ${data.country}`,
          latitude: latitude,
          longitude: longitude
        };

        // Send data to the backend
        await fetch('http://localhost:3000/log-visitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(visitorInfo)
        });

        // Display data in the result section
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `<p><strong>Name:</strong> ${name}</p>
                               <p><strong>IP:</strong> ${data.query}</p>
                               <p><strong>Location:</strong> ${data.city}, ${data.regionName}, ${data.country}</p>
                               <p><strong>Latitude:</strong> ${latitude}</p>
                               <p><strong>Longitude:</strong> ${longitude}</p>`;

        alert('Info logged successfully!');
      } catch (error) {
        console.error('Failed to log visitor info:', error);
      }
    }

    // Handle form submission
    document.getElementById('visitor-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            logVisitor(name, latitude, longitude);
          },
          (error) => {
            console.error('Geolocation error:', error);
            alert('Unable to retrieve location.');
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    });

    // Handle print button
    document.getElementById('print-button').addEventListener('click', () => {
      const resultDiv = document.getElementById('result');
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write('<html><head><title>Print</title></head><body>');
      printWindow.document.write(resultDiv.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    });
  </script>
</body>
</html>
*/
