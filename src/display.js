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

function conversion(temp) {
  const unformattedTemp = ((parseInt(temp, 10) - 32) * 5) / 9;
  const formattedTemp = parseFloat(unformattedTemp.toFixed(1));

  return formattedTemp;
}
//

const main = document.querySelector('main');
const article = document.querySelector('article');
let celsiusOn = true;

function toggleCelsius() {
  celsiusOn = !celsiusOn;
}

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
  const descriptionSection = document.querySelector('.description');
  const wrapperContainer = create('div', article, 'wrapper-container');
  const firstWrapper = create('div', wrapperContainer, 'first-wrapper');
  const secondWrapper = create('div', wrapperContainer, 'second-wrapper');

  createImg(firstWrapper, iconList[weatherData.days[i].icon]);
  const temperature = create('p', firstWrapper, 'temperature');
  temperature.setAttribute('aria-label', 'temperature');

  const fahrenheitTemp = create(
    'span',
    temperature,
    '',
    'fahrenheit-temperature',
    `${weatherData.days[i].temp}`,
  );

  const celsiusTemp = create(
    'span',
    temperature,
    '',
    'celsius-temperature',
    `${conversion(weatherData.days[i].temp)}`,
  );

  if (celsiusOn) {
    fahrenheitTemp.classList.add('hidden');
  } else {
    celsiusTemp.classList.add('hidden');
  }

  create('span', temperature, '', '', ` °`);
  const celsiusSymbol = create('span', temperature, '', 'celsius', 'C');
  create('span', temperature, '', 'divider', '|');
  const fahrenheit = create('span', temperature, '', 'fahrenheit', 'F');

  if (celsiusOn) {
    celsiusSymbol.classList.add('on');
  } else {
    fahrenheit.classList.add('on');
  }

  const infoList = [
    `Humidity: ${weatherData.days[i].humidity}%`,
    `Rain: ${weatherData.days[i].precipprob}%`,
    `Wind: ${weatherData.days[i].windspeed} km/h`,
  ];

  descriptionSection.replaceChildren();

  create('p', descriptionSection, 'description-title', '', 'Overview:');

  create(
    'p',
    descriptionSection,
    'description',
    '',
    `${weatherData.days[i].description}`,
  );

  infoList.forEach((el, index) => {
    create('p', secondWrapper, '', 'property', `${infoList[index]}`);
  });
};

const showWeek = function showWeekInfoCards(index, weatherData) {
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

    const fahrenheitTempMax = create(
      'p',
      textWrapper,
      '',
      'temp-max',
      `${day.tempmax}°`,
    );

    const fahrenheitTempMin = create(
      'p',
      textWrapper,
      '',
      'temp-min',
      `${day.tempmin}°`,
    );

    const celsiusTempMax = create(
      'p',
      textWrapper,
      '',
      'temp-max',
      `${conversion(day.tempmax)}°`,
    );
    const celsiusTempMin = create(
      'p',
      textWrapper,
      '',
      'temp-min',
      `${conversion(day.tempmin)}°`,
    );

    if (celsiusOn) {
      fahrenheitTempMax.classList.add('hidden');
      fahrenheitTempMin.classList.add('hidden');
    } else {
      celsiusTempMax.classList.add('hidden');
      celsiusTempMin.classList.add('hidden');
    }

    main.appendChild(nav);
  });

  const selectedSection = [...document.querySelectorAll('section')];
  const selectedTitle = [...document.querySelectorAll('h3')];
  selectedSection[index].classList.add('selected');
  selectedTitle[index].classList.add('selected-title');
};

export {
  select,
  selectId,
  updateHeader,
  errorMessage,
  clean,
  updateSelected,
  showWeek,
  toggleCelsius,
};
