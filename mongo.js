const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}
if (process.argv.length > 5) {
  console.log("too many arguments");
  process.exit(2);
}

const password = process.argv[2];
const url = `mongodb+srv://reanokeanu:${password}@cluster0.wehmws4.mongodb.net/personApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// get persons
if (process.argv.length == 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}

// add person
if (process.argv.length == 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const newPerson = new Person({
    name: name,
    number: number,
  });

  newPerson.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
