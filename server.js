const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001; // Define the port to listen on

// Middleware for parsing request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define API routes
// ...
app.get('/notes', (req, res) => {
  // Use res.sendFile() to send the notes.html file
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
