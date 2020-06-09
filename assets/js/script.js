var searchBtn = document.querySelector("#user-form");
var searchEl = document.querySelector("#username");
var todayDateEl = document.querySelector('#repo-search-term');
var todayTempEl = document.querySelector("#temp-main");
var todayHumidEl = document.querySelector("#humid-main");
var todayWindEl = document.querySelector("#wind-1");
var todayUvEl = document.querySelector("#uv-1");
var list = JSON.parse(localStorage.getItem('weatherStorage')) || [];


//=====================Fetch local data for today card===========================//
var getLocalWeather = function (user) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + user + ",us&APPID=35d3ddb8208b03fbaf1197e2a757e86e&units=imperial"
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                var btn = document.createElement("BUTTON");
                btn.className = "card-body prev-search";
                btn.innerHTML = user;
                document.getElementById("search-buttons").appendChild(btn);
                storeItems(user);
                response.json().then(function (data) {
                    todayDisplay(data);
                    UvIndexToday(data);
                });
            } else {
                alert("Error: " + response.statusText + '. ' + 'Please make sure the format is City, State');
            }
        })
    .catch(function (error) {
        alert("Unable to connect to Weather Services");
    });
};

var storeItems = function (searchRes) {
    const locInput = searchRes
    console.log(locInput)

    let weatherStorage;

    if (localStorage.getItem('weatherStorage') === null) {
        weatherStorage = [];
    } else {
        weatherStorage = JSON.parse(localStorage.getItem("weatherStorage"));
    }
    weatherStorage.push(locInput);

    localStorage.setItem('weatherStorage', JSON.stringify(weatherStorage))
}


//======== Local Storage Recall  ======//
function activateLocal(list) {
    list.preventDefault
    for (i=0; i<5;i++) {
        var weatherListItem = $(".local-store");
        weatherListItem.text(list);
    }
}


//===========Using this to capture the information put inside the input field====//
var formSubmitHandler = function (event) {
    event.preventDefault();

    var searchResult = searchEl.value;
    formSubmitFiveDay(searchResult);

    if (searchResult) {
        getLocalWeather(searchResult);
        searchEl.value = "";
    } else {
        alert("Please enter a city and/or state");
    }
}

//==================Today/Main box display============================//
var todayDisplay = function (data) {
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

//=============== UV Index check, based on number color red, yellow, green==========//
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

//==================set date in each 5 day forecast card=================//
var fiveDayDate = function (m) {
    for (var i = 2; i < 7; i++) {
        var dateStartEl = $("#date-" + i);
        var dateIncrement = m.add(1, 'days');
        dateStartEl[0].textContent = dateIncrement.format('L')
    }
};

//===================="forecast" data fetch for 5 day forecast==============//
var formSubmitFiveDay = function (input) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + input + ",us&APPID=35d3ddb8208b03fbaf1197e2a757e86e&units=imperial"
    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                fiveDayTemp(data);
            })
        })
};

//=================Gather all information for each day at 00:00:00 ============//
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

//================ Apply icons and information to DOM ===================//
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

// document.querySelector(".prev-search").addEventListener("submit", function () {
//     console.log("working")
// });

activateLocal(list)
searchBtn.addEventListener("submit", formSubmitHandler);