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
  toggleCelsius,
} from './display';

const input = selectId('location');
const form = select('form');
const inputNote = select('search span');
const main = select('main');
const article = select('article');
const description = select('.description');
let weatherData;
let selectedDay = 0;

const reset = function resetDisplayState() {
  clean();

  const nav = select('nav');

  if (nav) {
    nav.remove();
  }
};

const populate = function populateDisplayInfo() {
  updateHeader(weatherData);
  updateSelected(selectedDay, weatherData);
  showWeek(selectedDay, weatherData);
};

const getData = async function getDataFromAPI(location) {
  main.classList.add('hidden');
  description.classList.add('hidden');
  selectedDay = 0;
  reset();

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today/next7days?key=7KYEEP4DDZDT24Y93QVRY86EC&include=days&elements=datetime,tempmax,tempmin,temp,humidity,precipprob,windspeed,description,icon&iconSet=icons2`,
      { mode: 'cors' },
    );

    if (!response.ok) {
      main.classList.remove('hidden');
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

    main.classList.remove('hidden');
    description.classList.remove('hidden');
    populate();
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
  const nav = document.querySelector('nav');

  if (nav.contains(event.target)) {
    sections.forEach((el, index) => {
      if (el.classList.contains('selected')) {
        const h3 = el.querySelector('h3');
        h3.classList.remove('selected-title');
        el.classList.remove('selected');
      }

      if (el === event.target || el.contains(event.target)) {
        clean();
        updateHeader(weatherData);
        updateSelected(index, weatherData);
        selectedDay = index;
        el.classList.add('selected');
        const h3 = el.querySelector('h3');
        h3.classList.add('selected-title');
      }
    });
  }
};

const tempShift = function temperatureUnitShift(event) {
  const celsius = document.querySelector('.celsius');
  const fahrenheit = document.querySelector('.fahrenheit');

  if (
    (event.target === celsius && !celsius.classList.contains('on')) ||
    (event.target === fahrenheit && !fahrenheit.classList.contains('on'))
  ) {
    fahrenheit.classList.toggle('on');
    celsius.classList.toggle('on');
    toggleCelsius();
    reset();
    populate();
  }
};

article.addEventListener('click', tempShift);
main.addEventListener('click', change);
form.addEventListener('submit', handleClick);

input.addEventListener('focusin', () => {
  inputNote.classList.add('active');
  inputNote.textContent =
    'Enter your city, state, or country. You can separate them by commas.';
});

input.addEventListener('focusout', event => {
  const target = event.relatedTarget;
  if (target && target.matches('#search-btn')) {
    event.preventDefault();
  } else {
    inputNote.classList.remove('active');
    inputNote.textContent = '';
  }
});
