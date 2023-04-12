const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require('util');

// Promisify fs.readFile and fs.writeFile
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//setting up server
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//static middleware
app.use(express.static('./public'));

//api route
app.get("/api/notes", (req, res) => {
    let notes; // Declare notes variable
    readFileAsync("./db/db.json", "utf8").then((data) => {
        notes = [].concat(JSON.parse(data));
        res.json(notes);
    }).catch(err => {
        // Handle error if any
        console.error(err);
        res.status(500).send("Internal Server Error");
    });
});

app.post("/api/notes", (req, res) => {
    const note = req.body;
    readFileAsync("./db/db.json", "utf8").then((data) => {
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1;
        notes.push(note);
        return notes;
    }).then((notes) => {
        return writeFileAsync("./db/db.json", JSON.stringify(notes)); // Return the promise
    }).then(() => {
        res.json(note); // Send response to client after writeFileAsync completes
    }).catch(err => {
        // Handle error if any
        console.error(err);
        res.status(500).send("Internal Server Error");
    });
});

app.delete("/api/notes/:id", (req, res) => {
    const idToDelete = parseInt(req.params.id);
    readFileAsync("./db/db.json", "utf8").then((data) => {
        const notes = [].concat(JSON.parse(data));
        const newNotesData = [];
        for (let i = 0; i < notes.length; i++) {
            if (idToDelete !== notes[i].id) {
                newNotesData.push(notes[i]);
            }
        }
        return newNotesData;
    }).then((notes) => {
        return writeFileAsync("./db/db.json", JSON.stringify(notes)); // Return the promise
    }).then(() => {
        res.send('saved success!!!'); // Send response to client after writeFileAsync completes
    }).catch(err => {
        // Handle error if any
        console.error(err);
        res.status(500).send("Internal Server Error");
    });
});

//html routes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
