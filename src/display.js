import change from './index';

const iconList = {};

function importAll(moduleResolver) {
  moduleResolver.keys().forEach(key => {
    const iconName = key.replace('./', '').replace(/\.svg$/, '');
    iconList[iconName] = moduleResolver(key);
  });
}

importAll(require.context('./images', true, /\.svg$/));

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

const main = document.querySelector('main');
const article = document.querySelector('article');

const clean = function resetSearchDisplayState() {
  article.replaceChildren();
};

const updateHeader = function updateHeaderSearchInfo(weatherData) {
  const header = select('h2');
  header.textContent = 'Results for: ';
  create('span', header, '', '', `${weatherData.resolvedAddress}`);
};

const errorMessage = function displayErrorMessage(text) {
  const header = select('h2');
  header.textContent = text;
};

const updateSelected = function showSelectedDayInfo(i, weatherData) {
  clean();
  const infoList = [
    `Temperature: ${weatherData.days[i].temp}°`,
    `Humidity: ${weatherData.days[i].humidity}%`,
    `Rain: ${weatherData.days[i].precipprob}%`,
    `Wind: ${weatherData.days[i].windspeed} km/h`,
    `Description: ${weatherData.days[i].description}`,
  ];

  infoList.forEach((el, index) => {
    create('p', article, '', 'property', `${infoList[index]}`);
  });

  createImg(article, iconList[weatherData.days[i].icon]);
};

const showWeek = function showWeekInfoCards(weatherData) {
  const nav = create('nav', '', 'days-container');
  nav.addEventListener('click', change);

  weatherData.days.forEach(day => {
    const section = create('section', '', '', 'day-wrapper');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
      new Date(`${day.datetime}T00:00:00`).getDay()
    ];
    create('h3', section, '', 'week-day', days);
    createImg(section, iconList[day.icon]);
    const textWrapper = create('div', section, '', 'text-wrapper');
    create('p', textWrapper, '', 'temp-max', `${day.tempmax}°`);
    create('p', textWrapper, '', 'temp-min', `${day.tempmin}°`);

    nav.appendChild(section);
    main.appendChild(nav);
  });
};

export {
  select,
  selectId,
  updateHeader,
  errorMessage,
  clean,
  updateSelected,
  showWeek,
};
