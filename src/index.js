import './reset.css';
import './styles.css';

const input = document.getElementById('location');
const form = document.querySelector('form');
const inputNote = document.querySelector('input + span');
const header = document.querySelector('h2');
const article = document.querySelector('article');

const getData = async function getDataFromAPI(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today/next7days?key=7KYEEP4DDZDT24Y93QVRY86EC&include=days&elements=datetime,tempmax,tempmin,temp,humidity,precipprob,windspeed,description`,
      { mode: 'cors' },
    );

    if (!response.ok) {
      if (response.status === 400) {
        console.error('Location not found. Please, try again.');
      } else if (response.status === 500) {
        console.error('There was an issue with the server. Try again later.');
      } else {
        console.error(
          `Unexpected error: ${response.status} - ${response.statusText}`,
        );
      }
      return;
    }

    const weatherData = await response.json();

    header.textContent = 'Results for: ';
    const headerStyle = document.createElement('span');
    headerStyle.textContent = `${weatherData.resolvedAddress}`;
    header.append(headerStyle);
    article.textContent = `
    Date: ${weatherData.days[0].datetime}
    Temperature: ${weatherData.days[0].temp}
    Temperature (max.): ${weatherData.days[0].tempmax}
    Temperature (min.): ${weatherData.days[0].tempmin}
    Humidity: ${weatherData.days[0].humidity}
    Rain: ${weatherData.days[0].precipprob}
    Wind: ${weatherData.days[0].windspeed}
    Description: ${weatherData.days[0].description}`;
  } catch (error) {
    console.error('An unexpected error occurred. Please try again later.');
    console.log(error);
  }
};

const handleClick = function handleSearchBtnClick(event) {
  event.preventDefault();
  inputNote.classList.remove('active');
  inputNote.textContent = '';
  const filteredInput = input.value
    .normalize('NFD')
    .replace(/[^a-zA-Z, ]/g, '')
    .split(',')
    .map(el => el.trim());

  if (filteredInput.length >= 4) {
    filteredInput.splice(2, filteredInput.length - 3);
  }

  const location = filteredInput.toString().replace(/[ ]/g, '-');

  getData(location);
};

input.addEventListener('focusin', () => {
  inputNote.classList.add('active');
  inputNote.textContent =
    'Enter your city, state, or country. You can separate them by commas.';
});

form.addEventListener('submit', handleClick);

input.addEventListener('focusout', event => {
  const target = event.relatedTarget;
  if (target && target.matches('#search-btn')) {
    event.preventDefault();
  } else {
    inputNote.classList.remove('active');
    inputNote.textContent = '';
  }
});
