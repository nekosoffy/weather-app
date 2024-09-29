import './reset.css';
import './styles.css';

const iconList = {};

function importAll(moduleResolver) {
  moduleResolver.keys().forEach(key => {
    const iconName = key.replace('./', '').replace(/\.svg$/, ''); // Remove extension
    iconList[iconName] = moduleResolver(key);
  });
}

importAll(require.context('./images', true, /\.svg$/));

console.log(iconList);

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

function createImg(parent, source) {
  const el = document.createElement('img');

  el.src = source;

  parent.appendChild(el);
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
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today/next7days?key=7KYEEP4DDZDT24Y93QVRY86EC&include=days&elements=datetime,tempmax,tempmin,temp,humidity,precipprob,windspeed,description,icon&iconSet=icons2`,
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
    console.log(weatherData);

    header.textContent = 'Results for: ';
    const headerStyle = document.createElement('span');
    headerStyle.textContent = `${weatherData.resolvedAddress}`;
    header.append(headerStyle);

    const selectedDay = create('article', '', 'selected-day');
    const infoList = [
      `Temperature: ${weatherData.days[0].temp}°`,
      `Humidity: ${weatherData.days[0].humidity}%`,
      `Rain: ${weatherData.days[0].precipprob}%`,
      `Wind: ${weatherData.days[0].windspeed} km/h`,
      `Description: ${weatherData.days[0].description}`,
    ];

    infoList.forEach((el, index) => {
      create('p', selectedDay, '', 'property', `${infoList[index]}`);
    });

    createImg(selectedDay, iconList[weatherData.days[0].icon]);
    main.appendChild(selectedDay);
    const div = create('div', '', 'days-container');

    weatherData.days.forEach((day, index) => {
      const article = create('article', '', '', 'day-wrapper');
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
        new Date(`${weatherData.days[index].datetime}T00:00:00`).getDay()
      ];
      const weekday = create('p', article, '', 'week-day', days);
      const img = createImg(article, iconList[weatherData.days[index].icon]);
      const textWrapper = create('div', article, '', 'text-wrapper');
      const tempMin = create(
        'p',
        textWrapper,
        '',
        'temp-max',
        `${weatherData.days[index].tempmax}°`,
      );
      const tempMax = create(
        'p',
        textWrapper,
        '',
        'temp-min',
        `${weatherData.days[index].tempmin}°`,
      );

      div.appendChild(article);
      main.appendChild(div);
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
