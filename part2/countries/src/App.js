import React, { useState, useEffect } from "react";
import axios from "axios";
import Countries from "./components/Countries";
import CountryCard from "./components/CountryCard";

function App() {
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [message, setMessage] = useState("");
  const [country, setCountry] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [showAll, setshowAll] = useState(true);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(null);
  const api_key = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    if (city) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`
        )
        .then((response) => {
          setWeather(response.data);
        });
    }
  }, [city, api_key]);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    const filteredCountry = countries.filter((country) =>
      country.name.common.toLowerCase().includes(value.toLowerCase())
    );
    if (filteredCountry.length > 10) {
      setMessage("To many matches, specify another filter");
      setshowAll(false);
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } else if (filteredCountry.length === 1) {
      setCountry(filteredCountry);
      const capital = filteredCountry.map((capital) => capital.capital[0]);
      setCity(capital);
    } else {
      setCountries(filteredCountry);
      setShowButton(true);
    }
  };

  const handleButton = (id) => {
    const showCountry = countries.filter(
      (country) => country.name.common === id
    );
    setCountry(showCountry);
  };

  return (
    <div>
      <form onSubmit={onSearch}>
        find countries{" "}
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </form>
      <p>{message}</p>
      <div>
        {country !== null ? (
          <CountryCard country={country} weather={weather} capital={city} />
        ) : (
          <ul className="countries">
            {countries.map((country) => (
              <Countries
                key={country.name.common}
                country={country}
                handleButton={(e) => handleButton(e.target.id)}
                showButton={showButton}
                showAll={showAll}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
