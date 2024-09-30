import './reset.css';
import './styles.css';
import {
  select,
  selectId,
  updateHeader,
  errorMessage,
  clean,
  updateSelected,
  showWeek,
} from './display';

const input = selectId('location');
const form = select('form');
const inputNote = select('input + span');
let weatherData;

const getData = async function getDataFromAPI(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today/next7days?key=7KYEEP4DDZDT24Y93QVRY86EC&include=days&elements=datetime,tempmax,tempmin,temp,humidity,precipprob,windspeed,description,icon&iconSet=icons2`,
      { mode: 'cors' },
    );

    if (!response.ok) {
      if (response.status === 400) {
        errorMessage('Location not found. Please, try again.');
      } else if (response.status === 500) {
        errorMessage('There was an issue with the server. Try again later.');
      } else {
        errorMessage(
          `Unexpected error: ${response.status} - ${response.statusText}`,
        );
      }
      return;
    }

    weatherData = await response.json();

    updateHeader(weatherData);
    updateSelected(0, weatherData);
    showWeek(weatherData);
  } catch (error) {
    errorMessage('An unexpected error occurred. Please try again later.');
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

const change = function changeSelectedInfoCard(event) {
  const sections = document.querySelectorAll('section');
  sections.forEach((el, index) => {
    if (el === event.target || el.contains(event.target)) {
      clean();
      updateSelected(index, weatherData);
    }
  });
};

export default change;

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
