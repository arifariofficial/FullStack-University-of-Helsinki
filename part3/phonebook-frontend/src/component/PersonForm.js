import React, { useState } from "react";
import personService from "../services/person";

const PersonForm = ({ persons, setPersons, setErrorMessage }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (
      persons.find(({ name }) => name === newName) &&
      persons.find(({ number }) => number === newNumber)
    ) {
      alert(`${newName} is already added to phonebook`);
    } else if (!newName || !newNumber) {
      alert("name or number missing");
    } else if (
      persons.find(({ name }) => name === newName) &&
      persons.find(({ number }) => number !== newNumber)
    ) {
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with new one?`
      );
      const person = persons.find((person) => person.name === newName);
      const id = person.id;
      personService
        .update(id, personObject)
        .then((returnedValue) => {
          setPersons(
            persons.map((person) => (person.id !== id ? person : returnedValue))
          );
          setNewName("");
          setNewNumber("");
        })
        .catch((err) => setErrorMessage(err.response.data.error));
    } else {
      personService
        .create(personObject)
        .then((returnedValue) => {
          setPersons(persons.concat(returnedValue));
          setNewName("");
          setNewNumber("");
        })
        .catch((err) => setErrorMessage(err.response.data.error));

      setErrorMessage(`${personObject.name} was added `);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number:
          <input type="text" value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
