/* MVC - View
The View layer displays the model (weather data).
*/
import React from "react";

function WeatherDisplay({ weather, error }) {
  if (error) return <p style={{ color: "red" }}>⚠️ {error}</p>;
  if (!weather) return <p>Enter a city to get weather data.</p>;

  return (
    <div className="weather-display">
      <h2>{weather.name}</h2>
      <p>🌡️ Temp: {weather.main.temp} °C</p>
      <p>☁️ {weather.weather[0].description}</p>
      <p>💨 Wind: {weather.wind.speed} m/s</p>
    </div>
  );
}

export default WeatherDisplay;
