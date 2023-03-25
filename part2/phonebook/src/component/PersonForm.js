import React from "react";

const PersonForm = ({
  addNewPerson,
  setNewName,
  newNumber,
  setNewNumber,
  newName,
}) => {
  return (
    <div>
      {" "}
      <form onSubmit={addNewPerson}>
        <div>
          name:
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          number:
          <input
            type="text"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
