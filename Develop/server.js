const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend } = require('./public/assets/js/fsUtils');
const { v4: uuidv4 } = require('uuid');
const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// GET Route for homepage
app.get("/", (req,res) =>
res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for notes page
app.get("/notes", (req, res) =>
res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// GET route for api/notes that returns saved notes as JSON
app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});
// GET route for routes that don't exist
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html')
));
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
