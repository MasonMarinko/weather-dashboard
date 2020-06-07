const m = moment();
var searchBtn = document.querySelector("#user-form");
var searchEl = document.querySelector("#username");
var todayDateEl = document.querySelector('#repo-search-term');
var todayTempEl = document.querySelector("#temp-1");
var todayHumidEl = document.querySelector("#humid-1");
var todayWindEl = document.querySelector("#wind-1");
var todayUvEl = document.querySelector("#uv-1");
var list = JSON.parse(localStorage.getItem('newUserInput')) || {};

var getLocalWeather = function (user) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + user + ",us&APPID=35d3ddb8208b03fbaf1197e2a757e86e&units=imperial"
    fetch(apiUrl)
    .then(function (response) {
        //==========request is successful==============//
        if (response.ok) {
            response.json().then(function (data) {
                todayDisplay(data)
                UvIndexToday(data);
            });
        } else {
            alert("Error: " + response.statusText + '. ' +  'Please make sure the format is City, State');
        }
    })
    .catch(function (error) {
        //=====Notice this '.catch()' getting chained onto the end of the '.then()'
        alert("Unable to connect to Weather Services");
    });
};


//===========Using this to capture the information put inside the input field====//
var formSubmitHandler = function (event) {
    event.preventDefault();
    //====get value from input element=====//
    var searchResult = searchEl.value;


    if (searchResult) {
        getLocalWeather(searchResult);
        searchEl.value = "";
    } else {
        alert("Please enter a city and/or state");
    }
}

var todayDisplay = function (data) {
    var currentCity = data.name
    var currentTemp = data.main.temp
    var currentHum = data.main.humidity
    var currentWind = data.wind.speed
    var NowDate = m.format('L'); 
    todayDateEl.textContent=currentCity + ' (' + NowDate + ')';
    todayTempEl.textContent=currentTemp + " \xB0 F";
    todayHumidEl.textContent=currentHum + "%";
    todayWindEl.textContent=currentWind + " MPH";
    fiveDayDate();
};

var UvIndexToday = function (data) {
    lonItem = data.coord.lon
    latItem = data.coord.lat
    var apiUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat="+ latItem + "&lon=" + lonItem + "&APPID=35d3ddb8208b03fbaf1197e2a757e86e&units=imperial"
    fetch(apiUrl)
    .then(function(response) {
        response.json().then(function(data) {
            todayUvEl.textContent=data[0].value;
        })
    })
}

var fiveDayDate = function() {
    for (var i = 2; i < 7; i++) {
        
        var dateStartEl = $("#date-" + i);
        var dateIncrement = m.add(10, 'days').calendar();
        console.log(dateIncrement)
        console.log(dateStartEl)
        // dateStart.textContent = parseInt(m.format('HH'))
    }
}





searchBtn.addEventListener("submit", formSubmitHandler);