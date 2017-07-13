

var apiBaseUrl = 'http://en.sat24.com';
var year = 2000;
var month = 1;
var hour = 0;
var day = 0;

var rainURL = apiBaseUrl + '/image?type=forecastPrecip&region=europa&timestamp=';
var tempURL = apiBaseUrl + '/image?type=forecastTemp&region=europa&timestamp=';
var windURL = apiBaseUrl + '/image?type=forecastWind&region=europa&timestamp=';
var baseURL = rainURL;

var type = 'rain';

function weatherTypeChanged(){
	var x = document.getElementById('WeatherTypeForecast').value;
	var y = document.getElementById('scale');
	if(x  == 'Rainfall'){
    	baseURL = rainURL;
    	y.src = 'src/img/rainscale.png';
    }
	else if(x == 'Wind'){
    	baseURL = windURL;
    	y.src = 'src/img/windscale.png';
    }
	else if(x == 'Temperature'){
    	baseURL = tempURL;
    	y.src = 'src/img/tempscale.png';
    }
	refresh();
}

function refresh(){
	var imageE = document.getElementById('image');
	var textT = document.getElementById('time');
	var date = new Date();
	year = date.getFullYear();
	month = (date.getMonth() + 1);
	day = date.getDate();
	hour = 0;

	var stringDay = day;
	var stringMonth = month;

	if(month < 10){
		stringMonth = '0' + month;
	}
	if(day < 10){
		stringDay = '0' + day;
	}
	var fullUrl = baseURL + year.toString() + stringMonth.toString() + stringDay.toString() + "0000";
	imageE.src = fullUrl;
	textT.innerHTML = "Year: " + year.toString() + ", " + "Month: " + stringMonth.toString() + ", " + "Day: " + stringDay.toString() + ", " + "Hour: 0000";
}

function changeImagePrev(){
	var imageE = document.getElementById('image');
	var textT = document.getElementById('time');
	var date = new Date();

	if(hour === 0 && day == date.getDate()){
		return;
	}
	else if(hour === 0){
		hour = 21;
		day = day - 1;
	}
	else{
		hour = hour - 3;
	}

	var stringMonth = month.toString();
	var stringDay = day.toString();
	var stringHour = hour.toString();

	if(month < 10){
		stringMonth = '0' + month;
	}
	if(day < 10){
		stringDay = '0' + day;
	}
	if(hour < 10){
		stringHour = '0' + hour;
	}
	stringHour = stringHour + "00";
	var fullUrl = baseURL + year.toString() + stringMonth.toString() + stringDay.toString() + stringHour.toString();
	imageE.src = fullUrl;
	textT.innerHTML = "Year: " + year.toString() + ", " + "Month: " + stringMonth.toString() + ", " + "Day: " + stringDay.toString() + ", " + "Hour: " + stringHour.toString();
}

function changeImageNext() {
	var imageE = document.getElementById('image');
	var textT = document.getElementById('time');
	var date = new Date();
	if(hour == 21){
		hour = 0;
		day = day + 1;
	}
	else{
		hour = hour + 3;
	}
	var stringMonth = month.toString();
	var stringDay = day.toString();
	var stringHour = hour.toString();

	if(month < 10){
		stringMonth = '0' + month;
	}
	if(day < 10){
		stringDay = '0' + day;
	}
	if(hour < 10){
		stringHour = '0' + hour;
	}
	stringHour = stringHour + "00";
	var fullUrl = baseURL + year.toString() + stringMonth.toString() + stringDay.toString() + stringHour.toString();
	imageE.src = fullUrl;
	textT.innerHTML = "Year: " + year.toString() + ", " + "Month: " + stringMonth.toString() + ", " + "Day: " + stringDay.toString() + ", " + "Hour: " + stringHour.toString();
}

refresh();