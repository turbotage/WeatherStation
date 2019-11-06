var random = require('random');
var date = require('date-and-time');

function getDatetime() {
	var now = new Date();
	return date.format(now, 'YYYY-MM-DD:HH:mm:ss');
}

var last_humidity = random.uniform(0,100)();
function updateHumidity() {
	var humidity = random.uniform(last_humidity - 4, last_humidity + 4)();
	while ((humidity < 0) || (100 < humidity)) {
		humidity = random.uniform(last_humidity - 4, last_humidity + 4)();
	}
	last_humidity = humidity;

	var sql =  "INSERT INTO humidity (datetime,value) VALUES(\'" + getDatetime() 
		+ "\'," + humidity.toString() + ")";

	return sql;
}

var last_pressure = random.uniform(990,1020)();
function updatePressure() {
	var pressure = random.uniform(last_pressure - 3, last_pressure + 3)();
	while ((pressure < 950) || (1050 < pressure)) {
		pressure = random.uniform(last_pressure - 3, last_pressure + 2)();
	}
	last_pressure = pressure;

	var sql =  "INSERT INTO pressure (datetime,value) VALUES(\'" + getDatetime() 
		+ "\'," + pressure.toString() + ")";

	return sql;
}

last_temperature = random.uniform(10,20)();
function updateTemperature() {
	var temperature = random.uniform(last_temperature - 4, last_temperature + 4)();

	while ((temperature < -30) || (35 < temperature)) {
		temperature = random.uniform(last_temperature - 4, last_temperature + 4)();
	}
	last_temperature = temperature;

	var sql =  "INSERT INTO temperature (datetime,value) VALUES(\'" + getDatetime() 
		+ "\'," + temperature.toString() + ")";

	return sql;
}

var last_wind = random.uniform(0.2,15)();
var last_direction = random.uniform(0,360)();
function updateWind() {
	var direction = random.uniform(last_direction - 10, last_direction + 10)();
	while ((direction < 0) || (360 < direction)){
		direction = random.uniform(last_direction - 10, last_direction + 10)();
	}

	var wind;
	if (last_wind > 15) {
		wind = random.uniform(last_wind - 4, last_wind + 1.5)();
		while ((wind < 0) || (35 < wind)) {
			wind = random.uniform(last_wind - 4, last_wind + 1.5)();
		}
	}
	else {
		wind = random.uniform(last_wind - 4, last_wind + 4)();
		while ((wind < 0) || (35 < wind)) {
			wind = random.uniform(last_wind - 4, last_wind + 4)();
		}
	}

	last_wind = wind;
	last_direction = direction;

	sql = "INSERT INTO wind (datetime,wind,direction) VALUES(\'" + getDatetime() 
		+ "\'," + wind.toString() + "," + direction.toString() + ")";

	return sql;
}

function updateGust() {
	var gust = random.uniform(last_wind + 0.5, last_wind + 6)();
	while ((gust < 0.4) || (45 < gust)) {
		gust = random.uniform(last_wind + 0.5, last_wind + 6)();
	}

	var sql =  "INSERT INTO gust (datetime,value) VALUES(\'" + getDatetime() 
		+ "\'," + gust.toString() + ")";

	return sql;
}

var last_rainfall = 0;
function updateRainfall() {
	var rainfall = random.uniform(last_rainfall - 0.6, last_rainfall + 0.5)();
	while (last_rainfall > 30){
		rainfall = random.uniform(last_rainfall - 0.6, last_rainfall + 0.5)();
	}
	if (last_rainfall < 0) {
		rainfall = 0;
	}

	last_rainfall = rainfall;

	var sql =  "INSERT INTO rainfall (datetime,value) VALUES(\'" + getDatetime() 
		+ "\', " + rainfall.toString() + ")";

	return sql;
}

var last_error = "Manual Start";
function updateFetchStart() {
	var sql =  "INSERT INTO fetchstart (datetime,lasterror) VALUES(\'" + getDatetime() 
	+ "\',\'" + last_error + "\')";
	return sql;
}


module.exports.updateHumidity = updateHumidity;
module.exports.updatePressure = updatePressure;
module.exports.updateTemperature = updateTemperature;
module.exports.updateWind = updateWind;
module.exports.updateGust = updateGust;
module.exports.updateRainfall = updateRainfall;
module.exports.updateFetchStart = updateFetchStart;