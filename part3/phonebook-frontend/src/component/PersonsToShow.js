import personService from "../services/person";

const PersonsToShow = ({
  persons,
  setPersons,
  showAll,
  filter,
  setErrorMessage,
}) => {
  const personToShow = showAll
    ? persons
    : persons.filter(
        (person) => person.name.toLowerCase() === filter.toLowerCase()
      );
  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}`)) {
      personService.postDelete(id).catch((error) => {
        setErrorMessage(`${person.name} was already deleted`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setPersons(persons.filter((p) => p.id !== id));
      });
      setPersons(persons.filter((p) => p.id !== id));
      setErrorMessage(`${person.name} was deleted`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      {personToShow.map((person) => (
        <li key={person.name}>
          {person.name} {person.number}{" "}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </li>
      ))}
    </div>
  );
};

export default PersonsToShow;
