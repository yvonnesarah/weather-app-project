// Function to update the weather data in the UI
function refreshWeather(response) {
  // Select the relevant HTML elements
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#icon");

  // Extract weather data from API response
  let temperature = response.data.temperature.current;
  let date = new Date(response.data.time * 1000); // Convert timestamp to Date object

  // Update UI with weather data
  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  // Fetch the forecast data for the searched city
  getForecast(response.data.city);
}

// Function to format the date and time
function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[date.getDay()]; // Get the day name

  // Ensure minutes are always two digits (e.g., "09" instead of "9")
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

// Function to search for weather data of a specific city
function searchCity(city) {
  let apiKey = "8bcecf2b930c0252ec9aa584f9do621t"; // API key for authentication
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  // Make an API request and call refreshWeather function with the response
  axios.get(apiUrl).then(refreshWeather);
}

// Function to handle the search form submission
function handleSearchSubmit(event) {
  event.preventDefault(); // Prevent page reload
  let searchInput = document.querySelector("#search-form-input");

  // Call searchCity with the user-inputted city name
  searchCity(searchInput.value);
}

// Function to format the day name from a timestamp
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()]; // Return short day name
}

// Function to get the 5-day forecast for a city
function getForecast(city) {
  let apiKey = "8bcecf2b930c0252ec9aa584f9do621t";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  // Make an API request and call displayForecast function with the response
  axios(apiUrl).then(displayForecast);
}

// Function to display the weather forecast in the UI
function displayForecast(response) {
  let forecastHtml = ""; // Initialize empty string to store HTML content

  // Loop through the first 5 days of forecast data
  response.data.daily.forEach(function (day, index) {
    if (index < 5) { // Limit to 5-day forecast
      forecastHtml += `
        <div class="weather-forecast-day">
          <div class="weather-forecast-date">${formatDay(day.time)}</div>
          <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
          <div class="weather-forecast-temperatures">
            <div class="weather-forecast-temperature">
              <strong>${Math.round(day.temperature.maximum)}º</strong>
            </div>
            <div class="weather-forecast-temperature">${Math.round(day.temperature.minimum)}º</div>
          </div>
        </div>
      `;
    }
  });

  // Update the forecast section in the UI
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

// Add event listener to the search form to handle form submission
let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

// Default city to load weather data when the page loads
searchCity("London");