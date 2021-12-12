// Set up needed dependencies to run application

const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes

// GET request for HTML page- index/ app home page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/assets", "index.html"));
});

// GET request for HTML page - notes
app.get("/notes", function (req, res) {
  //sends a message to the client
  res.sendFile(path.join(__dirname + "/public/assets", "notes.html"));
});

//GET request for the notes data
app.get("/api/notes", function (req, res) {
  fs.readFile(__dirname + "/db/db.json", "utf-8", (err, data) => {
    if (err) throw err;
    return res.json(JSON.parse(data));
  });
});

// post notes to notes route
app.post("/api/notes", function (req, res) {
  fs.readFile(__dirname + "/db/db.json", "utf-8", (err, data) => {
    if (err) throw err;
    var notes = JSON.parse(data);
    // sets random number for the ID of the note per requirements
    req.body.id = uuidv4();
    notes.push(req.body);
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err) => {
      if (err) throw err;
      else res.json({ msg: "Success" });
    });
  });
});

// delete notes with id that equals the random ID used
app.delete("/api/notes/:id", function (req, res) {
  var deleteId = req.params.id;
  //  console.log(deleteId);
  fs.readFile(__dirname + "/db/db.json", "utf-8", (err, data) => {
    if (err) throw err;
    var notes = JSON.parse(data);
    var updatedNotes = notes.filter(({ id }) => id !== deleteId);
    var stringNotes = JSON.stringify(updatedNotes);

    fs.writeFile(__dirname + "/db/db.json", stringNotes, (err) => {
      if (err) throw err;
      else res.json({ msg: "Success" });
    });
  });
});

// Starts the server to begin listening

app.listen(PORT, function () {
  console.log("App listening on http://localhost:" + PORT);
});
