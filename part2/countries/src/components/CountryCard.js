import React from "react";
import Weather from "./Weather";

const CountryCard = ({ country, weather, capital }) => {
  if (country === null) {
    return null;
  }
  const languagesObj = country.map((laguage) => laguage.languages);
  const languages = Object.values(languagesObj[0]);
  const flags = country.map((country) => country.flags.png);

  return (
    <div>
      {country.map((country) => (
        <div key={country.name.common}>
          <h1>{country.name.common}</h1>
          <p>capital {country.capital}</p>
          <p>area {country.area}</p>
        </div>
      ))}
      <h2>languages:</h2>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={flags} alt="flag" />
      <Weather weather={weather} capital={capital} />
    </div>
  );
};

export default CountryCard;
