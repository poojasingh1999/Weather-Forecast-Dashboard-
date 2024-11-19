var apiKey = 'a59a541ade6f444c94254932241911';
var apiBaseUrl = 'https://api.weatherapi.com/v1/';

// function to fetch weather data
function fetchWeather(city, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiBaseUrl + 'current.json?key=' + apiKey + '&q=' + city, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            callback(null, JSON.parse(xhr.responseText));
        } else {
            callback(new Error('City not found'));
        }
    };
    xhr.onerror = function () {
        callback(new Error('Network error'));
    };
    xhr.send();
}

// Utility function to fetch 3-day forecast data
function fetchForecast(city, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiBaseUrl + 'forecast.json?key=' + apiKey + '&q=' + city + '&days=3', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            callback(null, JSON.parse(xhr.responseText).forecast.forecastday);
        } else {
            callback(new Error('Forecast not found'));
        }
    };
    xhr.onerror = function () {
        callback(new Error('Network error'));
    };
    xhr.send();
}

// Display error message in an alert
function displayError(message) {
    var errorAlert = document.getElementById('error-alert');
    var errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorAlert.style.display = 'block';
}

// Function to add city card to the dashboard
function addCityCard(city) {
    fetchWeather(city, function (error, weatherData) {
        if (error) {
            displayError(error.message);
            return;
        }

        fetchForecast(city, function (error, forecastData) {
            if (error) {
                displayError(error.message);
                return;
            }

            var cityCard = document.createElement('div');
            cityCard.className = 'col mb-4';
            cityCard.innerHTML = `
                <div class="card shadow-sm border-0">
                    <img src="https://wallpapers.com/images/featured/weather-xqhs9axpy8btfd3y.jpg" class="card-img-top" alt="Weather Image">
                    <div class="card-body">
                        <h5 class="card-title">${weatherData.location.name}</h5>
                        <p class="card-text text-muted">${weatherData.location.country}</p>
                        <div class="d-flex justify-content-between">
                            <p class="card-text fs-3">${weatherData.current.temp_c}°C</p>
                            <p class="card-text">${weatherData.current.condition.text}</p>
                        </div>

                        <div class="mb-3">
                            <h6 class="fw-bold">3-Day Forecast:</h6>
                            <ul class="list-group">
                                ${forecastData.map(day => `
                                    <li class="list-group-item">
                                        <strong>${new Date(day.date).toLocaleDateString()}</strong>
                                        <div class="d-flex justify-content-between">
                                            <span>Temp: ${day.day.avgtemp_c}°C</span>
                                            <span><i class="bi bi-cloud-sun"></i> ${day.day.condition.text}</span>
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>

                        <button class="btn btn-danger btn-sm remove-btn w-100">Remove</button>
                    </div>
                </div>
            `;

            // Add event listener for the remove button
            cityCard.querySelector('.remove-btn').addEventListener('click', function () {
                cityCard.remove();
            });

            // Append the card to the dashboard
            document.getElementById('dashboard').appendChild(cityCard);
        });
    });
}

// Initialize the dashboard with default cities
function initializeDashboard() {
    var defaultCities = ['New Delhi', 'Bengaluru', 'Chennai', 'Lucknow', 'Amritsar'];
    defaultCities.forEach(function(city) {
        addCityCard(city);
    });
}

// Event listener for adding a city
document.getElementById('add-city-btn').addEventListener('click', function () {
    var cityInput = document.getElementById('city-input');
    var city = cityInput.value.trim();
    if (city) {
        addCityCard(city);
        cityInput.value = '';
    } else {
        displayError('Please enter a city name');
    }
});

window.onload = initializeDashboard;
