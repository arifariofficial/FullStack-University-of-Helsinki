import { useState, useEffect } from "react";
import SearchFilter from "./component/SearchFilter";
import PersonForm from "./component/PersonForm";
import Persons from "./component/Persons";
import person from "./services/personService";
import Notification from "./component/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    person.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const addNewPerson = (e) => {
    e.preventDefault();
    const personObj = {
      name: newName,
      number: newNumber,
    };
    if (
      persons.find(
        ({ name, number }) => name === newName && number === newNumber
      )
    ) {
      alert(`${newName} is already added to phonebook`);
    } else if (
      persons.find(
        ({ name, number }) => name === newName && number !== newNumber
      )
    ) {
      if (
        window.confirm(
          `${newName} is already in the phonebook, replace the old one with a new one?`
        )
      ) {
        //finding id
        const index = persons.findIndex((person) => person.name === newName);
        person
          .update(index + 1, personObj)
          .then((response) =>
            setPersons(
              persons.map((person) =>
                person.id === index + 1 ? response : person
              )
            )
          )
          .catch((error) => {
            setNotification(
              `Information of ${newName} has been removed from server`
            );
            setTimeout(() => {
              setNotification(null);
            }, 2000);
            setPersons(persons.filter((person) => person.id !== index + 1));
          });

        setNewName("");
        setNewNumber("");
        setNotification(`Updated ${newName}`);
        setTimeout(() => {
          setNotification(null);
        }, 2000);
      }
    } else {
      person
        .create(personObj)
        .then((response) => setPersons(persons.concat(response)));
      setNewName("");
      setNewNumber("");
      setNotification(`Added ${newName}`);
      setTimeout(() => {
        setNotification(null);
      }, 2000);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`Delete ${persons[id - 1].name}`)) {
      person
        .deletePerson(id)
        .then((response) => {
          setPersons(persons.filter((person) => person.id !== id));
          setNotification(`${persons[id - 1].name} was deleted`);
          setTimeout(() => {
            setNotification(null);
          }, 2000);
        })
        .catch((error) => {
          alert(`${persons[id - 1].name} not found`);
          setPersons(persons.filter((person) => person.id !== id));
          console.log(error.message);
        });
    }
  };

  const searchItem = (e) => {
    setSearch(e.target.value);
    let filterPerson = persons.filter((person) =>
      person.name.toLowerCase().includes(search.toLowerCase())
    );
    setPersons(filterPerson);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <SearchFilter search={search} searchItem={searchItem} />
      <h2>add a new</h2>
      <PersonForm
        addNewPerson={addNewPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <Persons
            key={person.id}
            person={person}
            handleDelete={() => handleDelete(person.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
