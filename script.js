const form = document.querySelector('.form');
const input = document.querySelector('.form__input');
const KEY = '25c0f427c1b94f7ea55225510222705';

const getWeather = async function() {
    const weather = fetch('')
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