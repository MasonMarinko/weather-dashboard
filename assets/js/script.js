var searchBtn = document.querySelector("#user-form");
var searchEl = document.querySelector("#username");

var getLocalWeather = function () {

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=washington,utah&APPID=35d3ddb8208b03fbaf1197e2a757e86e"
    debugger
    fetch(apiUrl)
        .then(function(response) {
            return response.json(response);
        })
        .then(function(response) {
            console.log(response.main.temp)
        });

}


//===========Using this to capture the information put inside the input field====//
var formSubmitHandler = function (event) {
    event.preventDefault();
    //====get value from input element=====//
    var searchResult = searchEl.value;

    if (searchResult) {
        getLocalWeather();
        // searchEl.value = "";
    } else {
        alert("Please enter a city and/or state");
    }
}



getLocalWeather()
searchBtn.addEventListener("submit", formSubmitHandler);