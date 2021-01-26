const background = document.querySelector('body'),
  widgets = document.querySelectorAll('.widget'),
  widget_main = document.querySelector('.main-widget'),
  widget_quote = document.querySelector('.quote-widget'),
  widget_weather = document.querySelector('.weather-widget'),
  weather_info = document.querySelector('.weather__info'),
  weather_icon = document.querySelector('.weather__icon'),
  temperature = document.querySelector('.weather__temperature'),
  humidity = document.querySelector('.weather__humidity'),
  wind = document.querySelector('.weather__wind'),
  currentDate = document.querySelector('.calendar__date'),
  currentTime = document.querySelector('.calendar__time'),
  greeting = document.querySelector('.greeting__text'),
  name = document.querySelector('.greeting__name'),
  focus = document.querySelector('.focus'),
  city = document.querySelector('.city'),
  input = document.querySelectorAll('.input'),
  arrows = document.querySelectorAll('.arrows'),
  prev = document.querySelector('.arrows__prev'),
  next = document.querySelector('.arrows__next');


if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
  widgets.forEach(widget => {
    widget.classList.add('dark-widget-moz');
  });
}

function dayTimeNow(hours) {
  let current;

  if (hours >= 6 && hours < 12) {
    current = 'morning'; //morning
  } else if (hours >= 12 && hours < 18) {
    current = 'afternoon'; //day
  } else if (hours >= 18 && hours < 24) {
    current = 'evening'; //evening
  } else if (hours < 6) {
    current = 'night'; //night
  }
  return current;
}

function calendar() {

  const today = new Date(),
    hours = today.getHours(),
    minuts = today.getMinutes(),
    seconds = today.getSeconds(),
    day = today.getDay(),
    date = today.getDate(),
    month = today.getMonth();

  const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function addZero(n) { // prepend zero to the number if it is less then 10 (01-09)
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
  }

  let currentDaytime = dayTimeNow(hours);

  currentDate.textContent = `${week[day]}, ${date} ${months[month]}`;
  currentTime.textContent = `${hours}:${addZero(minuts)}:${addZero(seconds)}`;
  greeting.textContent = `Good ${currentDaytime},\u00A0`;

  if (hours === 0 && addZero(minuts) === '00' && seconds === 0) { // if 0:00:00 create new random images set
    newImageSet();
  }

  if (addZero(minuts) === '00' && seconds === 0) { // change bg when new hour starts
    changeBG(hours);
  }
}

// GLOBAL IMAGES OBJECT
let images = {
  'morning': [],
  'afternoon': [],
  'evening': [],
  'night': []
};

function newImageSet() {  // RANDOM IMAGES SET ON EACH LOAD
  images = { // reset images
    'morning': [],
    'afternoon': [],
    'evening': [],
    'night': []
  };

  // fill images randomely
  Object.values(images).forEach(dayTime => {
    for (let k = 0; k < 6; k++) {
      randomimage = Math.floor(Math.random() * Math.floor(23));
      if (!dayTime.includes(randomimage)) { // if image is not in the array yet push it into 
        dayTime.push(randomimage);
      } else { // if this image is already in array get another one
        k--;
      }
    }
  });
}

function changeBG(hours) {
  let currentDaytime = dayTimeNow(hours);

  background.style.background = `url(./assets/${currentDaytime}/${images[currentDaytime][hours % 6]}.jpg)`;
  background.style.backgroundSize = `cover`;
}

newImageSet(); // make new images set for 24 hours onload
calendar(); //   
setInterval(calendar, 1000); // update time and date each second

function getData(data) {
  if (localStorage.getItem(data.getAttribute('data')) === null) {
    if (data.getAttribute('data') === 'name') {
      data.innerText = 'Your name';
    } else if (data.getAttribute('data') === 'focus') {
      data.innerText = 'Your focus';
    } else {
      data.innerText = 'Your city';

    }
    // data.classList.add('notset');

  } else {
    data.innerText = localStorage.getItem(data.getAttribute('data'));
    data.removeAttribute("style");
    data.classList.remove('notset');
    return localStorage.getItem(data.getAttribute('data'));
  }
}
getData(focus);
getData(name);
getData(city);

input.forEach(input => {
  input.addEventListener('focus', e => {
    let tempwidth = e.target.clientWidth;
    e.target.innerText = '';
    e.target.setAttribute("style", `min-width: ${tempwidth}px`);
    input.classList.remove('error');
    // input.classList.add('notset');
    e.target.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
        return;
      }
    });
  });
});

function setData(data) {
  // if length input is not empty and contains not only whitespaces
  if (data.innerText.length > 0 && data.innerText.replace(/\s/g, '')) {
    localStorage.setItem(data.getAttribute('data'), data.innerText);
    data.removeAttribute("style");
    if (data.getAttribute('data') === 'city') {
      try {
        getWeather(getData(city));
      } catch (e) { }
    }
  }
}

input.forEach(input => {
  input.addEventListener('blur', e => {
    setData(e.target);
    getData(e.target);
  });

});

arrows.forEach(arrow => {
  arrow.addEventListener('click', e => {
    slider(e.target.getAttribute('data'));
  });
});

const todayGlobal = new Date();
changeBG(todayGlobal.getHours());

function slider(direction) {
  const backgroundImage = background.style.backgroundImage.split('/');// convert backgroud url into splitted parts  
  const currentImage = backgroundImage[backgroundImage.length - 1].split('.')[0]; // image name without extantion
  let currentDaytime = backgroundImage[backgroundImage.length - 2]; // daytime folder name
  const totalImages = images[currentDaytime].length - 1;
  let currentIndex = images[currentDaytime].indexOf(Number(currentImage));
  let indexOfDayTime = Object.keys(images).indexOf(currentDaytime);
  const imagesKeys = Object.keys(images);

  if (direction === 'next') {
    if (currentIndex < totalImages) {
      currentIndex++;
    } else {
      currentIndex = 0;
      if (indexOfDayTime < 3) {
        currentDaytime = imagesKeys[indexOfDayTime + 1];
      } else {
        currentDaytime = imagesKeys[0];
      }
    }
  } else { // if direction prev
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = totalImages;
      if (indexOfDayTime > 0) {
        currentDaytime = imagesKeys[indexOfDayTime - 1];
      } else {
        currentDaytime = imagesKeys[3];
      }
    }
  }
  viewBgImage(currentDaytime, images[currentDaytime][currentIndex]);
  arrows.forEach(arrow => {
    arrow.disabled = true;
  });

  arrows.forEach(arrow => {
    setTimeout(function () { arrow.disabled = false }, 1000);
  });
}

function viewBgImage(currentDaytime, image) {
  const src = `./assets/${currentDaytime}/${image}.jpg`;
  const img = document.createElement('img');
  img.src = src;
  img.onload = () => {
    background.style.backgroundImage = `url(${src})`;
    background.style.backgroundSize = 'cover';
  };
}


async function quotes() {
  const response = await fetch('https://type.fit/api/quotes');
  const quotes = await response.json();
  let accepted = false;

  while (!accepted) {
    let quote = quotes[Math.floor(Math.random() * quotes.length)];
    let text = quote.text;
    const author = quote.author;
    text = quote.text;
    if (text.length < 160) {
      accepted = true;
      quotetext.innerText = text;
      quoteauthor.innerText = author;
    }
  }
}

const quotetext = document.querySelector('.quote-text');
const quoteauthor = document.querySelector('.quote-author');

quotes();

getWeather = function (city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en&appid=c14cbfad910079565b03d284addb03ab&units=metric`)
    .then(resp => {
      if (!resp.ok) {
        city = '';
        localStorage.removeItem('city');
        console.log('The City not found');
        throw new Error('Ответ сети был не ok.');
      }
      return resp.json();
    })
    .then(function (data) {
      let hour = todayGlobal.getHours();
      iconVersion = '';
      if (hour >= 6 && hour < 18) {
        iconVersion = '-d';
      } else {
        iconVersion = '-n';
      }
      weather_icon.classList.remove(weather_icon.classList[2]);
      weather_icon.classList.add(`owf-${data.weather[0].id}${iconVersion}`);
      // console.log(data.weather[0].id);
      // console.log(temperature);
      temperature.classList.add('temperature-active');
      // console.log(temperature);
      temperature.innerText = `${data.main.temp.toFixed(0)}`;
      
      // wind speed
      wind.innerText = data.wind.speed;
      //humidity
      humidity.innerText = data.main.humidity;
    })
    .catch(function (e) {
      document.querySelector('.city').innerText = 'City not found ☹';
      document.querySelector('.city').classList.add('error');
      temperature.classList.remove('temperature-active');
      temperature.innerText = ``;
      wind.innerText = '';
      humidity.innerText = '';
      weather_icon.classList.remove(weather_icon.classList[2]);

    });
};

if (getData(city)) {
  getWeather(getData(city));
}
