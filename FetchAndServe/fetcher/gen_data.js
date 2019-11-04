const random = require('random');
const date = require('date-and-time');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function getDatetime() {
	var now = new Date();
	return date.format(now, 'YYYY-MM-DD:HH:mm:ss');
}

var last_humidity = random.uniform(0,100)();
function updateHumidity() {
	var humidity = random.uniform(last_humidity - 4, last_humidity + 4);
	while ((humidity < 0) || (100 < humidity)) {
		humidity = random.uniform(last_humidity - 4, last_humidity + 4);
	}
	last_humidity = humidity;

	var sql =  "INSERT INTO humidty (datetime,humidity) VALUES(\'" + getDatetime() 
		+ "\'," + humidity.toString() + ")";

	return sql;
}

var last_pressure = random.uniform(990,1020)();
function updatePressure() {
	var pressure = random.uniform(last_pressure - 3, last_pressure + 3);
	while ((pressure < 950) || (1050 < pressure)) {
		pressure = random.uniform(last_pressure - 3, last_pressure + 2);
	}
	last_pressure = pressure;

	var sql =  "INSERT INTO pressure (datetime,pressure) VALUES(\'" + getDatetime() 
		+ "\'," + pressure.toString() + ")";

	return sql;
}

last_temperature = random.uniform(10,20)();
function updateTemperature() {
	var temperature = random.uniform(last_temperature - 4, last_temperature + 4);
	while ((temperature < -30) || (35 < temperature)) {
		temperature = random.uniform(last_temperature - 4, last_temperature + 4);
	}
	last_temperature = temperature;

	var sql =  "INSERT INTO temperature (datetime,temperature) VALUES(\'" + getDatetime() 
		+ "\'," + temperature.toString() + ")";

	return sql;
}

var last_wind = random.uniform(0.2,15)();
var last_direction = random.uniform(0,360)();
function updateWind() {
	var direction = random.uniform(last_direction - 50, last_direction + 50);
	while ((direction < 0) || (360 < direction)){
		direction = random.uniform(last_direction - 50, last_direction + 50);
	}
	var wind = random.uniform(last_wind - 4, last_wind + 4);
	while ((wind < 0) || (35 < wind)) {
		wind = random.uniform(last_wind - 4, last_wind + 4);
	}

	last_wind = wind;
	last_direction = direction;

	sql = "INSERT INTO wind (datetime,wind,direction) VALUES(\'" + getDatetime() 
		+ "\'," + wind.toString() + "," + direction.toString() + + ")";

	return sql;
}

function updateGust() {
	var gust = random.uniform(last_wind + 0.5, last_wind + 6);
	while ((gust < 0.4) || (45 < gust)) {
		gust = random.uniform(last_wind + 0.5, last_wind + 6);
	}

	var sql =  "INSERT INTO gust (datetime,gust) VALUES(\'" + getDatetime() 
		+ "\'," + gust.toString() + ")";

	return sql;
}

var last_rainfall = 0;
function updateRainfall() {
	var rainfall = random.uniform(last_rainfall - 0.6, last_rainfall + 0.5);
	while (last_rainfall > 30){
		rainfall = random.uniform(last_rainfall - 0.6, last_rainfall + 0.5);
	}
	if (last_rainfall < 0) {
		rainfall = 0;
	}

	last_rainfall = rainfall;

	var sql =  "INSERT INTO rainfall (datetime,rainfall) VALUES(\'" + getDatetime() 
		+ "\'," + rainfall.toString() + ")";

	return sql;
}

var last_error = "Manual Start";
function updateFetchStart() {
	var sql =  "INSERT INTO fetchstart (datetime,lasterror) VALUES(\'" + getDatetime() 
	+ "\'," + last_error.toString() + ")";
}

function submitQuery(connection,sql) {
	connection.query(sql, function(err, rows, result) {
		if (err) throw err;
	});
}

async function run(connection, sleepTime) {
	await sleep(6000);
	var sql = updateFetchStart();
	submitQuery(connection, sql);

	while (true) {
		sql = updateRainfall();
		submitQuery(connection, sql);

		for(var i = 0; i < 3; i++) {
			sql = updateHumidity();
			submitQuery(connection, sql);

			sql = updatePressure();
			submitQuery(connection, sql);

			sql = updateTemperature();
			submitQuery(connection, sql);

			sql = updateWind();
			submitQuery(connection, sql);

			sql = updateGust();
			submitQuery(connection, sql);

			sleep(sleepTime * 1000);
		}

	}

}

function genData(connection, sleepTime) {
	run(connection, sleepTime);	
}

module.exports.genData = genData;