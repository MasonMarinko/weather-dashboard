var searchBtn = document.querySelector("#user-form");
var searchEl = document.querySelector("#username");
var todayDateEl = document.querySelector('#repo-search-term');
var todayTempEl = document.querySelector("#temp-main");
var todayHumidEl = document.querySelector("#humid-main");
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
                    todayDisplay(data);
                    UvIndexToday(data);
                });
            } else {
                alert("Error: " + response.statusText + '. ' + 'Please make sure the format is City, State');
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
    formSubmitFiveDay(searchResult);

    if (searchResult) {
        getLocalWeather(searchResult);
        searchEl.value = "";
    } else {
        alert("Please enter a city and/or state");
    }
}

var todayDisplay = function (data) {
    console.log(data)
    const m = moment();
    var currentCity = data.name;
    var currentTemp = data.main.temp;
    var currentHum = data.main.humidity;
    var currentWind = data.wind.speed;
    var currentIcon = data.weather[0].main;
    var IconEl = $("#icon-info")
    var NowDate = m.format('L');
    todayDateEl.textContent = currentCity + ' (' + NowDate + ')';
    todayTempEl.textContent = currentTemp + " \xB0 F";
    todayHumidEl.textContent = currentHum + "%";
    todayWindEl.textContent = currentWind + " MPH";
    if (currentIcon === "Clear") {
        IconEl.addClass("oi oi-cloud")
    } else if (currentIcon === "Clouds") {
        IconEl.addClass("oi oi-sun")
    } else if (currentIcon === "Rain") {
        iconEl.addClass("oi oi-rain")
    }
    fiveDayDate(m);
};

var UvIndexToday = function (data) {
    lonItem = data.coord.lon
    latItem = data.coord.lat
    var apiUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + latItem + "&lon=" + lonItem + "&APPID=35d3ddb8208b03fbaf1197e2a757e86e&units=imperial"
    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                var uvIndexCheck = data[0].value;
                todayUvEl.textContent = uvIndexCheck;
                if (uvIndexCheck >= 6) {
                    $("#uv-1").addClass("uv-index-bad")
                } else if (uvIndexCheck < 6 && uvIndexCheck > 3) {
                    $("#uv-1").addClass("uv-index-mod")
                } else if (uvIndexCheck <= 3) {
                    $("#uv-1").addClass("uv-index-good")
                }
            })
        })
}

var fiveDayDate = function (m) {

    for (var i = 2; i < 7; i++) {
        var dateStartEl = $("#date-" + i);
        var dateIncrement = m.add(1, 'days');
        dateStartEl[0].textContent = dateIncrement.format('L')
    }
};

var formSubmitFiveDay = function (input) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + input + ",us&APPID=35d3ddb8208b03fbaf1197e2a757e86e&units=imperial"
    fetch(apiUrl)
        .then(function (response) {
            //==========request is successful==============//
            response.json().then(function (data) {
                fiveDayTemp(data);
            })
        })
};

var fiveDayTemp = function (data) {
    var tempArray = [];
    var humidArray = [];
    var iconArray = [];
    for (i = 0; i < data.list.length; i++) {
        var timeVerify = (data.list[i].dt_txt);
        var timeSplit = timeVerify.split(" ");
        var finalTest = (timeSplit[1]);
        var tempIncrement = data.list[i].main.temp;
        var humidIncrement = data.list[i].main.humidity;
        var iconIncrement = data.list[i].weather[0].main;
        if (finalTest === "00:00:00") {
            tempArray.push(tempIncrement)
            humidArray.push(humidIncrement)
            iconArray.push(iconIncrement)
        }
    }
    tempArrayContent(tempArray, humidArray, iconArray)
}

var tempArrayContent = function (temp, humid, icon) {
    for (i = 0; i < temp.length; i++) {
        var tempDayOverall = $("#temp-" + (i + 2));
        var humidDayOverall = $("#humid-" + (i + 2));
        var iconDayOverall = $("#icon-" + (i + 2));
        tempDayOverall[0].textContent = "Temp: " + temp[i] + " \xB0 F";
        humidDayOverall[0].textContent = "Humidity: " + humid[i] + "%";
        if (icon[i] === "Clear") {
            iconDayOverall.addClass("oi oi-cloud")
        } else if (icon[i] === "Clouds") {
            iconDayOverall.addClass("oi oi-sun")
        } else if (icon[i] === "Rain") {
            iconDayOverall.addClass("oi oi-rain")
        }

    }
}


// .list[0].main.temp
searchBtn.addEventListener("submit", formSubmitHandler);