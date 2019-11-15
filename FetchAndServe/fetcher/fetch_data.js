// Datetime stuff
var date = require('date-and-time');

function getDatetime() {
	var now = new Date();
	return date.format(now, 'YYYY-MM-DD:HH:mm:ss');
}

//Database stuff
var db = require('./db');

function submitQuery(sql, callback) {
	db.query(sql, function(err, rows, result) {
		if (err) throw err;
		//console.log(result);

		//console.log('Successful query: ' + sql);

		callback();
	});
}

// Serial stuff
var arduino = require('./arduino');

arduino.addClassifier('humidity', function(lastTypeCmd){
	return ('humidity' == lastTypeCmd);
});

arduino.addClassifier('pressure', function(lastTypeCmd){
	return ('pressure' == lastTypeCmd);
});

arduino.addClassifier('temperature', function(lastTypeCmd){
	return ('temperature' == lastTypeCmd);
});

arduino.addClassifier('direction', function(lastTypeCmd){
	return ('direction' == lastTypeCmd);
});

arduino.addClassifier('wind', function(lastTypeCmd){
	return ('wind' == lastTypeCmd);
});

arduino.addClassifier('gust', function(lastTypeCmd){
	return ('gust' == lastTypeCmd);
});

arduino.addClassifier('rainfall', function(lastTypeCmd){
	return ('rainfall' == lastTypeCmd);
});


//Updating functions

function updateHumidity(callback) {
	arduino.once('humidity', function(humidity) {
		var sql =  "INSERT INTO humidity (datetime,value) VALUES(\'" + getDatetime() 
		+ "\'," + humidity + ")";

		submitQuery(sql, callback);
	});

	arduino.send('1', 'humidity');
}

function updatePressure(callback) {
	arduino.once('pressure', function(pressure) {
		var sql =  "INSERT INTO pressure (datetime,value) VALUES(\'" + getDatetime() 
		+ "\'," + pressure + ")";

		submitQuery(sql, callback);
	});

	arduino.send('2', 'pressure');
}

function updateTemperature(callback) {
	arduino.once('temperature', function(temperature) {
		var sql =  "INSERT INTO temperature (datetime,value) VALUES(\'" + getDatetime() 
		+ "\'," + temperature + ")";

		submitQuery(sql, callback);
	});

	arduino.send('3', 'temperature');
}

function updateWind(callback) {
	arduino.once('direction', function(direction) {
		
		arduino.once('wind', function(wind){
			var sql = "INSERT INTO wind (datetime,wind,direction) VALUES(\'" + getDatetime() 
				+ "\'," + wind + "," + direction + ")";

			submitQuery(sql, callback);
		});

		arduino.send('5', 'wind');
	});

	arduino.send('4', 'direction');

	/*
	sql = "INSERT INTO wind (datetime,wind,direction) VALUES(\'" + getDatetime() 
		+ "\'," + wind.toString() + "," + direction.toString() + ")";

	return sql;
	*/
}

function updateGust(callback) {
	arduino.once('gust', function(gust) {
		var sql =  "INSERT INTO gust (datetime,value) VALUES(\'" + getDatetime() 
		+ "\'," + gust + ")";

		submitQuery(sql, callback);
	});

	arduino.send('6', 'gust');
}

function updateRainfall(callback) {
	arduino.once('rainfall', function(rainfall) {
		var sql =  "INSERT INTO rainfall (datetime,value) VALUES(\'" + getDatetime() 
		+ "\'," + rainfall + ")";

		submitQuery(sql, callback);
	});

	arduino.send('7', 'rainfall');
}

var last_error = "Manual Start";
function updateFetchStart(callback) {
	var sql =  "INSERT INTO fetchstart (datetime,lasterror) VALUES(\'" + getDatetime() 
	+ "\',\'" + last_error + "\')";
	
	submitQuery(sql, callback);
}

module.exports.updateHumidity = updateHumidity;
module.exports.updatePressure = updatePressure;
module.exports.updateTemperature = updateTemperature;
module.exports.updateWind = updateWind;
module.exports.updateGust = updateGust;
module.exports.updateRainfall = updateRainfall;
module.exports.updateFetchStart = updateFetchStart;

