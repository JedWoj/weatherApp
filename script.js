const form = document.querySelector('.form');
const input = document.querySelector('.form__input');
const cityAndDate = document.querySelector('.content__city'); 
const weekday = document.querySelector('.content__day');
const hour = document.querySelector('.content__time');
const temperature = document.querySelector('.content__temp');
const sky = document.querySelector('.content__sky');
const icon = document.querySelector('.content__sun');
const errMessage = document.querySelector('.error');
const historyContainer = document.querySelector('.history__list');
const forecastDays = [...document.querySelectorAll('.forecast__day')];
const KEY = '25c0f427c1b94f7ea55225510222705';
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const renderHistory = function(searchHistory) {
    if(searchHistory === null) return; 
    historyContainer.innerHTML = '';
    searchHistory.forEach(search => {
        const li = document.createElement('li');
        li.classList.add('history__item');
        li.textContent = search;
        historyContainer.appendChild(li);
    });
}

const addToHistory = function(data) {
    let searchHistory = [];
    if(localStorage.getItem('history')) {
        searchHistory = JSON.parse(localStorage.getItem('history'));
        
        if(searchHistory.length === 5) {
            searchHistory.pop();
            searchHistory.unshift(data.location.name);
        } else {
            searchHistory.unshift(data.location.name);
        }
    } else {
        searchHistory.unshift(data.location.name);
    }
    localStorage.setItem('history', JSON.stringify(searchHistory));
    renderHistory(searchHistory);
}

const errMessageHandler = function(boolen) {
    if(boolen) return errMessage.classList.add('hidden');
    errMessage.classList.remove('hidden');
}

const errorMessage = function(err) {
    errMessage.textContent = err;
}

const getInitialForecast = async function(lat,lng) {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${KEY}&q=${lat},${lng}&days=7`);
    const data = await response.json();
    setForecastTiles(data);
}

const weekDay = function(string) {
    const date = new Date(string);
    return `${days[date.getDay()]}`;
}

const setForecastTiles = function(data) {
    forecastDays.forEach((day,index) =>  {
        const date = data.forecast.forecastday[index].date;
        day.querySelector('.forecast__day-name').textContent = weekDay(date);
        day.querySelector('.forecast__temp').textContent = `${data.forecast.forecastday[index].day.maxtemp_c} C`;
        day.querySelector('.forecast__icon').src = data.forecast.forecastday[index].day.condition.icon;
    });
}

const getForecast = async function(location) {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${KEY}&q=${location}&days=7`);
    const data = await response.json();
    setForecastTiles(data);
}

const getInitialWeather = async function(lat,lng) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${lat},${lng}`);
    const data = await response.json();
    setWeather(data);
}

const userData = function() {
    navigator.geolocation.getCurrentPosition((pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        getInitialWeather(latitude,longitude);
        getInitialForecast(latitude,longitude);
    }, () => {
        const latitude = 53.20;
        const longitude = 16.66;
        getInitialWeather(latitude,longitude);
        getInitialForecast(latitude,longitude);
    });
}

const getDayName = function(string) {
    const date = new Date(string);
    return days[date.getDay()];
}

const getDate = function(string) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(string);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

const setWeather = function(data) {
    const time = data.location.localtime.split(' ').splice(1,2);
    const [dayName] = data.location.localtime.split(' ').splice(0,1);
    cityAndDate.textContent = `${data.location.name}, ${getDate(dayName)}`;
    weekday.textContent = `${getDayName(dayName)}`;
    hour.textContent = `${time}`;
    temperature.textContent = `${data.current.temp_c} C`;
    sky.textContent = `${data.current.condition.text}`;
    icon.src = `${data.current.condition.icon}`;
    input.value = '';
}

const getWeather = async function(value) {
    try {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${value}`);
    const data = await response.json();
    if(data.error) throw Error(data.error.message);
    setWeather(data);
    addToHistory(data);
    errMessageHandler(true);
    } catch(err) {
        errorMessage(err);
        errMessageHandler(false);
    }
}

const checkInput = function() {
    const value = input.value;
    if(!value) return 
    getWeather(value);
    getForecast(value);
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    checkInput();
});

historyContainer.addEventListener('click', (e) => {
    const target = e.target.closest('li');
    if(target === null) return
    getWeather(target.textContent);
    getForecast(target.textContent);
})

const init = function() {
    userData();
    renderHistory(JSON.parse(localStorage.getItem('history')) || null);
}

init();