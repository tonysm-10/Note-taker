const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import the uuidv4 function from the uuid package

const app = express();
const PORT = process.env.PORT || 3001; // Define the port to listen on

// Middleware for parsing request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define API routes
// ...
app.get('/', (req, res) => {
  // Use res.sendFile() to send the notes.html file
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
  // Use res.sendFile() to send the notes.html file
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  // Use res.sendFile() to send the notes.html file
  res.sendFile(path.join(__dirname, 'db/db.json'));
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  // Generate a unique ID for the new note using uuidv4()
  newNote.id = uuidv4();

  // Read the existing notes from the db.json file
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes data.' });
    }

    // Parse the existing notes data from JSON
    const notes = JSON.parse(data);

    // Add the new note to the notes array
    notes.push(newNote);

    // Write the updated notes data back to the db.json file
    fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save note data.' });
      }

      // Return the newly created note as the response
      res.json(newNote);
    });
  });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
