import Filter from "./component/Filter";
import PersonForm from "./component/PersonForm";
import PersonsToShow from "./component/PersonsToShow";
import { useState, useEffect } from "react";
import personService from "./services/person";
import Notification from "./component/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialValues) => {
      setPersons(initialValues);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter filter={filter} setFilter={setFilter} setShowAll={setShowAll} />
      <h3>add a new</h3>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        setErrorMessage={setErrorMessage}
      />
      <h2>Numbers</h2>
      <PersonsToShow
        persons={persons}
        setPersons={setPersons}
        showAll={showAll}
        filter={filter}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default App;
