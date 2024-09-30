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
  create('h2', article);
};

const updateHeader = function updateHeaderSearchInfo(weatherData) {
  const header = select('h2');
  header.textContent = `${weatherData.resolvedAddress}`;
};

const errorMessage = function displayErrorMessage(text) {
  const header = select('h2');
  header.textContent = text;
};

const updateSelected = function showSelectedDayInfo(i, weatherData) {
  const wrapperContainer = create('div', article, 'wrapper-container');
  const firstWrapper = create('div', wrapperContainer, 'first-wrapper');
  const secondWrapper = create('div', wrapperContainer, 'second-wrapper');

  createImg(firstWrapper, iconList[weatherData.days[i].icon]);
  const temperature = create('p', firstWrapper, 'temperature');
  temperature.setAttribute('aria-label', 'temperature');

  create(
    'span',
    temperature,
    '',
    'main-temperature',
    `${weatherData.days[i].temp}`,
  );

  create('span', temperature, '', '', ` °`);
  const celsius = create('span', temperature, '', 'celsius', 'C');
  create('span', temperature, '', 'divider', '|');
  const fahrenheit = create('span', temperature, '', 'fahrenheit', 'F');
  celsius.classList.add('on');
  fahrenheit.classList.add('off');

  const infoList = [
    `Humidity: ${weatherData.days[i].humidity}%`,
    `Rain: ${weatherData.days[i].precipprob}%`,
    `Wind: ${weatherData.days[i].windspeed} km/h`,
  ];

  create(
    'p',
    secondWrapper,
    'description',
    '',
    `${weatherData.days[i].description}`,
  );

  infoList.forEach((el, index) => {
    create('p', secondWrapper, '', 'property', `${infoList[index]}`);
  });
};

const showWeek = function showWeekInfoCards(weatherData) {
  const nav = create('nav', '', 'days-container');

  weatherData.days.forEach(day => {
    const button = create('button', nav);
    const section = create('section', button, '', 'day-wrapper');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
      new Date(`${day.datetime}T00:00:00`).getDay()
    ];
    create('h3', section, '', 'week-day', days);
    createImg(section, iconList[day.icon]);
    const textWrapper = create('div', section, '', 'text-wrapper');
    create('p', textWrapper, '', 'temp-max', `${day.tempmax}°`);
    create('p', textWrapper, '', 'temp-min', `${day.tempmin}°`);

    main.appendChild(nav);
    const selectedSection = document.querySelector('section');
    const selectedTitle = document.querySelector('h3');
    selectedSection.classList.add('selected');
    selectedTitle.classList.add('selected-title');
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
