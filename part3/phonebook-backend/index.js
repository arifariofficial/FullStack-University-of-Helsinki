const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const Person = require("./models/person");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("data", (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);
const unknownPoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted  id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).send({ error: err.message });
  }
  next(err);
};

app.get("/api/persons", (req, res) => {
  Person.find({}).then((item) => {
    res.json(item);
  });
});

app.get("/info", (req, res) => {
  const time = new Date();
  const data = `Phonebook has info for ${Person.length} people <br/> ${time}`;

  res.send(data);
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((item) => {
      if (item) {
        res.json(item);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((item) => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const data = req.body;

  const person = new Person({
    name: data.name,
    number: data.number,
  });

  person
    .save()
    .then((item) => {
      res.json(item);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;
  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((item) => {
      res.json(item);
    })
    .catch((err) => next(err));
});

app.use(unknownPoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
