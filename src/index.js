import './reset.css';
import './styles.css';

// Helper functions
const select = target => document.querySelector(target);
const selectId = target => document.getElementById(target);

function create(element, parent, id, htmlClass, text) {
  const el = document.createElement(element);

  if (id !== undefined && id !== '') {
    el.id = id;
  }

  if (htmlClass !== undefined && htmlClass !== '') {
    el.classList.add(htmlClass);
  }

  if (text !== undefined && text !== '') {
    el.textContent = text;
  }

  if (parent !== undefined && parent !== '') {
    parent.appendChild(el);
  }

  return el;
}
//

const input = selectId('location');
const form = select('form');
const inputNote = select('input + span');
const header = select('h2');
const main = document.querySelector('main');

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

    const selectedDay = create('article', '', 'selected-day');
    const queijo = Object.entries(weatherData.days[0]);
    const names = [
      'Date',
      'Temperature',
      'Temperature (max.)',
      'Temperature (min.)',
      'Humidity',
      'Rain',
      'Wind',
      'Description',
    ];
    queijo.forEach((el, index) => {
      create('p', selectedDay, '', 'property', `${names[index]}: ${el[1]}`);
    });
    main.appendChild(selectedDay);

    weatherData.days.forEach((day, index) => {
      const article = create('article', '', '', 'day-wrapper');
      const temp = create(
        'p',
        article,
        '',
        'temp',
        `${weatherData.days[index].temp}`,
      );
      const tempMin = create(
        'p',
        article,
        '',
        'temp-min',
        `${weatherData.days[index].tempmin}`,
      );
      const tempMax = create(
        'p',
        article,
        '',
        'temp-max',
        `${weatherData.days[index].tempmax}`,
      );
      main.appendChild(article);
    });
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
