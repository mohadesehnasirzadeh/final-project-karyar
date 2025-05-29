function initWeatherApp() {
  const weatherForm = document.getElementById("weather-form");
  const cityInput = document.getElementById("city-input");

  weatherForm.addEventListener("submit", handleWeatherSearch);

  showWeatherDefault();
}
async function handleWeatherSearch(e) {
  e.preventDefault();

  const city = document.getElementById("city-input").value.trim();
  if (!city) return;

  showWeatherLoading();

  try {
    const API_KEY = "f0c9ce8db108b8c213e6443e8dca095f";

    const response = await fetch(
      `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${encodeURIComponent(
        city
      )}`
    );

    if (!response.ok) {
      throw new Error("Weather API request failed");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.info || "Failed to get weather data");
    }

    showWeatherData(data);
  } catch (error) {
    console.error("Weather fetch error:", error);
    showWeatherError();
  }
}

function showWeatherLoading() {
  hide(["weather-results", "weather-default"]);
  show(["weather-loading"]);
}

function showWeatherDefault() {
  hide(["weather-loading", "weather-results"]);
  show(["weather-default"]);
}

function showWeatherError() {
  hide(["weather-loading"]);
  showWeatherDefault();
}

function showWeatherData(data) {
  hide(["weather-loading", "weather-default"]);

  const weatherResults = document.getElementById("weather-results");
  weatherResults.innerHTML = `
        <div class="weather-header">
            <h3 class="weather-city">${data.location.name}</h3>
            <p class="weather-country">${data.location.country}</p>
        </div>
        
        <div class="weather-grid">
            <div class="weather-card">
                <h4>Temperature</h4>
                <div class="weather-value">${data.current.temperature}°C</div>
            </div>
            <div class="weather-card">
                <h4>Condition</h4>
                <div class="weather-value">${data.current.weather_descriptions.join(
                  ", "
                )}</div>
            </div>
            <div class="weather-card">
                <h4>Humidity</h4>
                <div class="weather-value">${data.current.humidity}%</div>
            </div>
            <div class="weather-card">
                <h4>Wind Speed</h4>
                <div class="weather-value">${data.current.wind_speed} km/h</div>
            </div>
            <div class="weather-card">
                <h4>Pressure</h4>
                <div class="weather-value">${data.current.pressure} mb</div>
            </div>
            <div class="weather-card">
                <h4>Visibility</h4>
                <div class="weather-value">${data.current.visibility} km</div>
            </div>
        </div>
    `;

  show(["weather-results"]);

  setTimeout(() => lucide.createIcons(), 0);
}

function show(elementIds) {
  elementIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.remove("hidden");
    }
  });
}

function hide(elementIds) {
  elementIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add("hidden");
    }
  });
}
