const Weather = ({ weather, capital }) => {
  if (weather === null) {
    return null;
  }

  const iconData = weather.weather;
  const icon = iconData[0].icon;

  return (
    <div>
      <h1>Weather in {capital}</h1>
      <p>temperature {weather.main.temp} Celcius</p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt="weather icon"
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  );
};

export default Weather;
