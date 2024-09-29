import './reset.css';
import './styles.css';

const input = document.getElementById('location');
const button = document.querySelector('button');

const getData = async function getDataFromAPI(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today/next7days?key=7KYEEP4DDZDT24Y93QVRY86EC&include=days&elements=datetime,tempmax,tempmin,temp,humidity,precipprob,windspeed,description`,
      { mode: 'cors' },
    );
    const weatherData = await response.json();
    console.log(weatherData.resolvedAddress, weatherData.days);
  } catch (error) {
    console.log(error);
  }
};

const handleClick = function handleSearchBtnClick() {
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

button.addEventListener('click', handleClick);
