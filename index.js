const cityName = document.querySelector(".cityName");
const temperature = document.querySelector(".temperature");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const weatherIcon = document.querySelector(".weatherIcon");
const weather = document.querySelector(".weather");
const searchBtn = document.querySelector(".searchBtn");
const currentBtn = document.querySelector(".currentBtn");
const inputText = document.querySelector(".inputText");
const forecast = document.querySelector(".forecast");

searchBtn.addEventListener("click", getWeather);
currentBtn.addEventListener("click", getWeatherByLocation);

function kelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(2);
}

function getWeather() {
  wind.innerHTML = "Loading....";
  if (inputText.value === "") {
    return;
  }
  const city = inputText.value;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7d0f5b499b29f424498a2119677b7e2d`
  )
    .then((response) => response.json())
    .then((data) => {
      cityName.innerHTML = data.name;
      temperature.innerHTML =
        "Temperature: " + kelvinToCelsius(data.main.temp) + " °C";
      wind.innerHTML = "Wind Speed: " + data.wind.speed + " m/s";
      humidity.innerHTML = "Humidity: " + data.main.humidity + "%";
      weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weather.innerHTML = data.weather[0].description;

      // Fetch 5-day forecast
      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=7d0f5b499b29f424498a2119677b7e2d`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      forecast.innerHTML = "";
      for (let i = 0; i < data.list.length; i += 8) {
        // Show forecast for every 24 hours
        const forecastItem = data.list[i];
        const date = new Date(forecastItem.dt * 1000);
        forecast.innerHTML += `
          <div class="forecast-item">
            <p>${date.toDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${
              forecastItem.weather[0].icon
            }@2x.png" alt="weather icon"/>
            <p>Temperature: ${kelvinToCelsius(forecastItem.main.temp)} °C</p>
            <p>Wind: ${forecastItem.wind.speed} m/s</p>
            <p>Humidity: ${forecastItem.main.humidity}%</p>
          </div>
        `;
      }
    })
    .catch((err) => console.log(err));

  inputText.value = "";
}

function getWeatherByLocation() {
  wind.innerHTML = "Loading....";
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=7d0f5b499b29f424498a2119677b7e2d`
    )
      .then((response) => response.json())
      .then((data) => {
        cityName.innerHTML = data.city.name;
        temperature.innerHTML =
          "Temperature: " + kelvinToCelsius(data.list[0].main.temp) + " °C";
        wind.innerHTML = "Wind Speed: " + data.list[0].wind.speed + " m/s";
        humidity.innerHTML = "Humidity: " + data.list[0].main.humidity + "%";
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;
        weather.innerHTML = data.list[0].weather[0].description;

        forecast.innerHTML = "";
        for (let i = 0; i < data.list.length; i += 8) {
          // Show forecast for every 24 hours
          const forecastItem = data.list[i];
          const date = new Date(forecastItem.dt * 1000);
          forecast.innerHTML += `
            <div class="forecast-item">
              <p>${date.toDateString()}</p>
              <img src="https://openweathermap.org/img/wn/${
                forecastItem.weather[0].icon
              }@2x.png" alt="weather icon"/>
              <p>Temperature: ${kelvinToCelsius(forecastItem.main.temp)} °C</p>
              <p>Wind: ${forecastItem.wind.speed} m/s</p>
              <p>Humidity: ${forecastItem.main.humidity}%</p>
            </div>
          `;
        }
      })
      .catch((err) => console.log(err));
  });
}
