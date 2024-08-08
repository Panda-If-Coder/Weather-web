const searchInput = document.getElementById('searchInput');
const clearButton = document.getElementById('clearButton');
const weatherInfo = document.getElementById('weatherInfo');
const weatherIcon = document.getElementById('weatherIcon');
const resultsArea = document.getElementById('resultsArea');
const API_KEY = 'bfccee6bf51c1c2a2d717bcf630bff82'; 
let currentCity = '';

clearButton.addEventListener('click', () => {
searchInput.value = '';
  searchInput.focus();
  resetDisplay();
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = searchInput.value.trim();
if (city) {
      currentCity = city;
      const activeTab = document.querySelector('.tab.active');
      fetchWeatherData(city, activeTab.dataset.tab);
    }
  }
});

function resetDisplay() {
  weatherInfo.textContent = 'Search for a city to see weather information';
  weatherIcon.textContent = '🌦️';
  resultsArea.innerHTML = `
    <div id="weatherIcon">🌦️</div>
    <p id="weatherInfo">Search for a city to see weather information</p>
  `;
}

async function fetchWeatherData(city, tab) {
  let url;
  switch (tab) {
 case 'current':
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
      break;
case 'forecast':
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
      break;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    
if (data.cod == '404') {
      weatherInfo.textContent = `City not found. Please try again.`;
      weatherIcon.textContent = '❓';
    } else {
  if (tab === 'current') {
        displayCurrentWeather(data);
      } else if (tab === 'forecast') {
        displayForecast(data);
      }
    }
  } catch (error) {
    weatherInfo.textContent = `An error occurred. Please try again.`;
    weatherIcon.textContent = '❗';
  }
}

function displayCurrentWeather(data) {
  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  weatherInfo.textContent = `${data.name}: ${temp}°C, ${description}`;
  weatherIcon.textContent = getWeatherEmoji(data.weather[0].main);
}

function displayForecast(data) {
  resultsArea.innerHTML = `<h3>5-Day Forecast for ${data.city.name}</h3>`;
  const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
  dailyForecasts.forEach(day => {
    const date = new Date(day.dt * 1000).toLocaleDateString();
    const temp = Math.round(day.main.temp);
    const description = day.weather[0].description;
    const emoji = getWeatherEmoji(day.weather[0].main);
    resultsArea.innerHTML += `
      <div class="forecast-item">
        ${emoji} ${date}: ${temp}°C, ${description}
      </div>
    `;
  });
}


function getWeatherEmoji(weatherMain) {
  const emojiMap = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Smoke: '💨',
    Haze: '😶‍🌫️',
    Dust: '💨',
    Fog: '🌫️',
    Sand: '💨',
    Ash: '🌋',
    Squall: '💨',
    Tornado: '🌪️'
  };
  return emojiMap[weatherMain] || '🌦️';
}
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    if (currentCity) {
      fetchWeatherData(currentCity, tab.dataset.tab);
    }
  });
});