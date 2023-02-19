require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

morgan.token("body", (req) => {
  if (Object.keys(req.body).length) {
    return JSON.stringify(req.body);
  }
});

const app = express();
app.use(
  cors(),
  express.static("build"),
  express.json(),
  morgan(":method :url :status :res[content-length] :response-time ms :body")
);

// info
app.get("/info", (req, res) => {
  const timeNow = new Date(Date.now());
  return res.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <div>${timeNow.toUTCString()}</div>`);
});

// get persons
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    return res.json(persons);
  });
});

// add person
app.post("/api/persons", (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "name missing" });
  }
  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number || "",
  });
  newPerson.save().then((person) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    return res.json(person);
  });
});

// remove person
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id).then((result) => {
    return res.status(204).end();
  });
});

// // get person
// app.get("/api/persons/:id", (req, res) => {
//   const id = req.params.id
//   const person = persons.find((person) => person.id === id);
//   if (!person) {
//     return res.status(404).end();
//   }
//   return res.json(person);
// });

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

function randomId() {
  return Math.floor((Math.random() * Date.now()) / 10000000);
}
