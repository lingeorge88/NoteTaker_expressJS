const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
// port for heroku deployment
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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
app.get('/api/notes', async(req, res) => {
  const dbJson = await JSON.parse(fs.readFileSync("db/db.json", "utf8"));
  res.json(dbJson);
});

app.post('/api/notes', (req, res) => {
  const dbJson = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
  const newNote1 = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4(),
  };
  console.log(`Post request received: ${newNote1}`);
  dbJson.push(newNote1);
  fs.writeFileSync("db/db.json", JSON.stringify(dbJson));
  res.json(dbJson);
});
app.delete('/api/notes/:id', (req,res) =>{
  let data = fs.readFileSync("db/db.json", "utf8");
  const dataJSON = JSON.parse(data);
  const newNotes = dataJSON.filter((note) =>{
    return note.id !== req.params.id;
  });
  fs.writeFileSync("db/db.json", JSON.stringify(newNotes));
  res.json("Selected note has been deleted. ❌🗑️");
})
// GET route for routes that don't exist
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html')
));
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
