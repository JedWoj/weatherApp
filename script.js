const form = document.querySelector('.form');
const input = document.querySelector('.form__input');
const cityAndDate = document.querySelector('.content__city'); 
const weekday = document.querySelector('.content__day');
const hour = document.querySelector('.content__time');
const temperature = document.querySelector('.content__temp');
const sky = document.querySelector('.content__sky');
const icon = document.querySelector('.content__sun');
const KEY = '25c0f427c1b94f7ea55225510222705';

const getInitialWeather = async function(lat,lng) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${lat},${lng}`);
    const data = await response.json();
    setWeather(data);
}

const preparedData = function() {
    navigator.geolocation.getCurrentPosition((pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        getInitialWeather(latitude,longitude);
    }, () => {
        const latitude = 53.15;
        const longitude = 16.65;
        getInitialWeather(latitude,longitude);
    });
}

const getDayName = function(string) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(string)
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
}

const getWeather = async function(value) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${value}`);
    const data = await response.json();
    setWeather(data);
    console.log(data)
}

const checkInput = function() {
    const value = input.value;
    if(!value) return 
    getWeather(value);
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    checkInput();
})

preparedData();