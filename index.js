const cityName = document.querySelector(".cityName");
const temperature = document.querySelector(".temperature");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const weatherIcon = document.querySelector(".weatherIcon");
const weather = document.querySelector(".weather");
const searchBtn = document.querySelector(".searchBtn");
const currentBtn = document.querySelector(".currentBtn");
const inputText = document.querySelector(".inputText");
searchBtn.addEventListener("click", getWeather);

function getWeather() {
  const city = inputText.value;
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7d0f5b499b29f424498a2119677b7e2d`
  )
    .then((response) => response.json())
    .then((data) => {
      cityName.innerHTML = data.name;
      temperature.innerHTML = "Temperature:" + data.main.temp;
      wind.innerHTML = data.wind.speed;
      humidity.innerHTML = data.main.humidity;
      weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weather.innerHTML = data.weather[0].description;
    })
    .catch((err) => console.log(err));

  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=7d0f5b499b29f424498a2119677b7e2d"
  );
}
