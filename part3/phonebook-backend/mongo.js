const mongoose = require("mongoose");

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://ariful6:${password}@cluster0.tceqdtd.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: `${name}`,
  number: `${number}`,
});

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.map((item) => {
      console.log(`${item.name} ${item.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("node mongo.js yourpassword Anna 040-1234556");
  process.exit(1);
}
