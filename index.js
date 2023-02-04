const { res, response } = require("express");
const express = require("express");
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json(), requestLogger);

app.get("/info", (req, res) => {
  const timeNow = new Date(Date.now());
  return res.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <div>${timeNow.toUTCString()}</div>`);
});

app.get("/api/persons", (req, res) => {
  return res.json(persons);
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "name missing" });
  }
  if (persons.find((person) => person.name === req.body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }
  const person = {
    id: randomId(),
    name: req.body.name,
    number: req.body.number || "",
  };
  persons = persons.concat(person);
  return res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    return res.status(404).end();
  }
  return res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  return res.status(204).end();
});

app.use(unknownEndpoint);

function requestLogger(req, res, next) {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  next();
}

function randomId() {
  return Math.floor((Math.random() * Date.now()) / 10000000);
}

function unknownEndpoint(req, res) {
  res.status(404).send({ error: "unknown endpoint" });
}

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
