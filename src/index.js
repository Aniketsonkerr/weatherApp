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
const dropdownContent = document.getElementById("dropdown-content");

// Add event listeners for search and current location buttons
searchBtn.addEventListener("click", getWeather);
currentBtn.addEventListener("click", getWeatherByLocation);

// Function to convert Kelvin to Celsius
function kelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(2);
}

// Function to update the dropdown menu with recently searched cities
function updateDropdown() {
  dropdownContent.innerHTML = "";
  const cities = JSON.parse(localStorage.getItem("cities")) || [];
  cities.forEach((city) => {
    const cityElement = document.createElement("a");
    cityElement.href = "#";
    cityElement.innerText = city;
    cityElement.addEventListener("click", () => {
      inputText.value = city;
      getWeather();
    });
    dropdownContent.appendChild(cityElement);
  });
}

// Function to save a new city to local storage and update the dropdown menu
function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem("cities")) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
    updateDropdown();
  }
}

// Function to fetch and display weather data for the input city
function showError(message) {
  cityName.innerHTML = "";
  temperature.innerHTML = "";
  wind.innerHTML = "";
  humidity.innerHTML = "";
  weatherIcon.src = "";
  weather.innerHTML = "";
  forecast.innerHTML = "";
  alert(message); // Display error message as an alert
}

function getWeather() {
  if (inputText.value === "") {
    showError("Please enter a city name.");
    return;
  }
  wind.innerHTML = "Loading....";
  cityName.innerHTML = " ";
  temperature.innerHTML = " ";
  humidity.innerHTML = " ";
  const city = inputText.value;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7d0f5b499b29f424498a2119677b7e2d`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found or API error.");
      }
      return response.json();
    })
    .then((data) => {
      cityName.innerHTML = data.name;
      temperature.innerHTML =
        "Temperature: " + kelvinToCelsius(data.main.temp) + " °C";
      wind.innerHTML = "Wind Speed: " + data.wind.speed + " m/s";
      humidity.innerHTML = "Humidity: " + data.main.humidity + "%";
      weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weather.innerHTML = data.weather[0].description;

      saveCity(city);

      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=7d0f5b499b29f424498a2119677b7e2d`
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Forecast data not available.");
      }
      return response.json();
    })
    .then((data) => {
      forecast.innerHTML = "";
      for (let i = 0; i < data.list.length; i += 8) {
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
    .catch((err) => {
      console.log(err);
      showError("Failed to fetch weather data. Please try again.");
    });

  inputText.value = "";
}

// Function to fetch and display weather data based on the user's current location
function getWeatherByLocation() {
  wind.innerHTML = "Loading....";
  cityName.innerHTML = " ";
  temperature.innerHTML = " ";
  humidity.innerHTML = " ";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=7d0f5b499b29f424498a2119677b7e2d`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch weather data for location.");
          }
          return response.json();
        })
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
            const forecastItem = data.list[i];
            const date = new Date(forecastItem.dt * 1000);
            forecast.innerHTML += `
              <div class="forecast-item">
                <p>${date.toDateString()}</p>
                <img src="https://openweathermap.org/img/wn/${
                  forecastItem.weather[0].icon
                }@2x.png" alt="weather icon"/>
                <p>Temperature: ${kelvinToCelsius(
                  forecastItem.main.temp
                )} °C</p>
                <p>Wind: ${forecastItem.wind.speed} m/s</p>
                <p>Humidity: ${forecastItem.main.humidity}%</p>
              </div>
            `;
          }
        })
        .catch((err) => {
          console.log(err);
          showError("Failed to fetch weather data. Please try again.");
        });
    },
    (error) => {
      console.log(error);
      showError(
        "Failed to get current location. Please allow location access."
      );
    }
  );
}
// Initialize the dropdown menu with cities from local storage on page load
updateDropdown();
