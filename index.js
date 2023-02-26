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
    <div>Phonebook has info for
    ${Person.find({}).then((persons) => persons.length)}
    people</div>
    <div>${timeNow.toUTCString()}</div>`);
});

// get persons
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      return res.json(persons);
    })
    .catch((error) => next(error));
});

// add person
app.post("/api/persons", (req, res, next) => {
  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number || "",
  });
  newPerson
    .save()
    .then((person) => {
      console.log(`added ${person.name} number ${person.number} to phonebook`);
      return res.json(person);
    })
    .catch((error) => next(error));
});

// remove person
app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then(() => {
      return res.status(204).end();
    })
    .catch((error) => next(error));
});

// get person
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).end();
      }
      return res.json(person);
    })
    .catch((error) => next(error));
});

// change person
app.put("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((person) => {
      return res.json(person);
    })
    .catch((error) => next(error));
});

// unknown endpoint
const unknownEdpoint = (req, res) => {
  return res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEdpoint);

// error handler
const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).json({ error: error.message });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

// port listener
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
