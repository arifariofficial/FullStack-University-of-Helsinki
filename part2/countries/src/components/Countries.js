import React from "react";

const Countries = ({ country, handleButton, showButton, showAll }) => {
  if (showAll) {
    return (
      <li className="country">
        {country.name.common}{" "}
        {showButton ? (
          <button id={country.name.common} onClick={handleButton}>
            show
          </button>
        ) : null}
      </li>
    );
  } else return null;
};
export default Countries;
