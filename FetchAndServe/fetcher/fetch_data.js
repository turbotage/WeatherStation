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
	var timeout = null;

	var listener = function(humidity) {
		clearTimeout(timeout);
		
		var value = parseFloat(humidity);
		//if values are incorrect don't push them to database
		if ((value > 100.0) || (value < 0.0)) {
			callback();
		} else {
			var sql =  "INSERT INTO humidity (datetime,value) VALUES(\'" + getDatetime() 
				+ "\'," + humidity + ")";

			submitQuery(sql, callback);
		}
	}

	arduino.once('humidity', listener);

	timeout = setTimeout(function(){
		arduino.removeListener('humidity', listener);
		callback();
	}, 500);

	arduino.send('1', 'humidity');
}

function updatePressure(callback) {
	var timeout = null;

	var listener = function(pressure) {
		clearTimeout(timeout);
		
		var value = parseFloat(pressure);
		//if values are incorrect don't push them to database
		if ((value > 1100.0) || (value < 850.0)) {
			callback();
		} else {
			var sql =  "INSERT INTO pressure (datetime,value) VALUES(\'" + getDatetime() 
				+ "\'," + pressure + ")";

			submitQuery(sql, callback);
		}
	}

	arduino.once('pressure', listener);

	timeout = setTimeout(function(){
		arduino.removeListener('pressure', listener);
		callback();
	}, 500);

	arduino.send('2', 'pressure');
}

function updateTemperature(callback) {
	var timeout = null;

	var listener = function(temperature) {
		clearTimeout(timeout);
		
		var value = parseFloat(temperature);
		//if values are incorrect don't push them to database
		if ((value > 50.0) || (value < -80.0)) {
			callback();
		} else {
			var sql =  "INSERT INTO temperature (datetime,value) VALUES(\'" + getDatetime() 
				+ "\'," + temperature + ")";

			submitQuery(sql, callback);
		}
	}

	arduino.once('temperature', listener);

	timeout = setTimeout(function(){
		arduino.removeListener('temperature', listener);
		callback();
	}, 500);

	arduino.send('3', 'temperature');
}

function updateWind(callback) {
	var timeout1 = null;
	var timeout2 = null;
	var dir = null;

	var listener2 = function(wind){
		var windF = parseFloat(wind);
		var dirF = parseFloat(dir);
		
		if ((windF > 60.0) || (windF < 0.0)) {
			if ((dirF > 360.0) || (dirF < 0.0)) {
				callback();
			}
		} else {
			var sql = "INSERT INTO wind (datetime,wind,direction) VALUES(\'" + getDatetime() 
				+ "\'," + wind + "," + dir + ")";

			submitQuery(sql, callback);
		}
	}

	var listener1 = function(direction) {
		dir = direction;

		arduino.once('wind', listener2);

		arduino.send('5', 'wind');
	}

	arduino.once('direction', listener1);

	timeout = setTimeout(function(){
		arduino.removeListener('direction', listener1);
		arduino.removeListener('wind', listener2);
		callback();
	}, 500);

	arduino.send('4', 'direction');
}

function updateGust(callback) {
	var timeout = null;

	var listener = function(gust) {
		clearTimeout(timeout);
		
		var value = parseFloat(gust);
		//if values are incorrect don't push them to database
		if ((value > 100.0) || (value < 0)) {
			callback();
		} else {
			var sql =  "INSERT INTO gust (datetime,value) VALUES(\'" + getDatetime() 
				+ "\'," + gust + ")";

			submitQuery(sql, callback);
		}
	}

	arduino.once('gust', listener);

	timeout = setTimeout(function(){
		arduino.removeListener('temperature', listener);
		callback();
	}, 500);

	arduino.send('6', 'gust');
}

function updateRainfall(callback) {
	var timeout = null;

	var listener = function(rainfall) {
		clearTimeout(timeout);
		
		var value = parseFloat(rainfall);
		//if values are incorrect don't push them to database
		if ((value > 50) || (value < 0)) {
			callback();
		} else {
			var sql =  "INSERT INTO rainfall (datetime,value) VALUES(\'" + getDatetime() 
				+ "\'," + rainfall + ")";

			submitQuery(sql, callback);
		}
	}

	arduino.once('rainfall', listener);

	timeout = setTimeout(function(){
		arduino.removeListener('rainfall', listener);
		callback();
	}, 500);

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

