function refreshWeather(response) {
    let temperatureElement = document.querySelector('#temperature');
    let cityElement = document.querySelector('#city');
    let descriptionElement = document.querySelector('#description');
    let humidityElement = document.querySelector('#humidity');
    let windSpeedElement = document.querySelector('#wind-speed');
    let timeElement = document.querySelector('#time');
    let iconElement = document.querySelector('#icon');
    
    let date = new Date(response.data.time * 1000);

    cityElement.textContent = response.data.city;
    timeElement.textContent = formatDate(date);
    descriptionElement.textContent = response.data.condition.description;
    humidityElement.textContent = `${response.data.temperature.humidity}%`;
    windSpeedElement.textContent = `${response.data.wind.speed} km/h`;
    temperatureElement.textContent = Math.round(response.data.temperature.current);
    iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" alt="Weather Icon" />`;

    getForecast(response.data.city);
}

function formatDate(date) {
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2, '0');
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let day = days[date.getDay()];

    return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
    let encodedApiKey = 'MDRhZjBmMDQ2YWRiMTJvdDRmM2RiNzYxMDI2OGZiMGY=';
    let apiKey = atob(encodedApiKey);
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

    axios.get(apiUrl)
        .then(refreshWeather)
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Failed to fetch weather data. Please try again.");
        });
}

function handleSearchSubmit(event) {
    event.preventDefault();
    let searchInput = document.querySelector('#search-form-input');
    searchCity(searchInput.value.trim());
}

function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

function getForecast(city) {
    let encodedApiKey = 'MDRhZjBmMDQ2YWRiMTJvdDRmM2RiNzYxMDI2OGZiMGY=';
    let apiKey = atob(encodedApiKey);
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

    axios.get(apiUrl)
        .then(displayForecast)
        .catch(error => {
            console.error("Error fetching forecast data:", error);
            alert("Failed to fetch forecast data. Please try again.");
        });
}

function displayForecast(response) {
    let forecastHtml = '';
    response.data.daily.forEach(function (day, index) {
        if (index < 5) {
            forecastHtml += `
                <div class="weather-forecast-day">
                    <div class="weather-forecast-date">${formatDay(day.time)}</div>
                    <img src="${day.condition.icon_url}" class="weather-forecast-icon" alt="Weather Icon" />
                    <div class="weather-forecast-temperatures">
                        <div class="weather-forecast-temperature"><strong>${Math.round(day.temperature.maximum)}º</strong></div>
                        <div class="weather-forecast-temperature">${Math.round(day.temperature.minimum)}º</div>
                    </div>
                </div>`;
        }
    });

    let forecastElement = document.querySelector('#forecast');
    forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector('#search-form');
searchFormElement.addEventListener('submit', handleSearchSubmit);

searchCity('');
