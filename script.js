const form = document.querySelector('.form');
const input = document.querySelector('.form__input');
const cityAndDate = document.querySelector('.content__city'); 
const weekday = document.querySelector('.content__day');
const KEY = '25c0f427c1b94f7ea55225510222705';

const getDayName = function(string) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(string)
    return days[date.getDay()];
}

const setWeather = function(data) {
    let time = data.location.localtime.split(' ').splice(1,2);
    const [dayName] = data.location.localtime.split(' ').splice(0,1);
    cityAndDate.textContent = `${data.location.name}, ${time}`;
    weekday.textContent = `${getDayName(dayName)}`
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