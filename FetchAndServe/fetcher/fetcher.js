
var settings = require('./settings');
var db = require('./db');

/**
function msleep(n) {
	 Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
function sleep(n) {
	msleep(n*1000);
}
*/

function submitQuery(sql) {
	db.query(sql, function(err, rows, result) {
		if (err) throw err;
		//console.log(result);
		console.log(sql);
	});
}

var fetcher;

if (!settings.gen_data) {
	fetcher = require('./fetch_data');
}
else {
	fetcher = require('./gen_data');
}

submitQuery(fetcher.updateFetchStart())

function updateAllButRainfall() {
	submitQuery(fetcher.updateHumidity());
	submitQuery(fetcher.updatePressure());
	submitQuery(fetcher.updateTemperature());
	submitQuery(fetcher.updateGust());
	submitQuery(fetcher.updateWind());
}

function updateRainfall() {
	submitQuery(fetcher.updateRainfall());
}

setInterval(updateAllButRainfall, settings.time*1000);
setInterval(updateRainfall, 5*settings.time*1000);


/**
 * 
 var generator = require('./gen_data.js');
 generator.genData(connection, argv.gen_time);
 console.log("in end");
 connection.end();
 */
/*
if (argv.hasOwnProperty("gen_data")) {
	var dataGenerator = require('./gen_data.js');
	
	if (!argv.hasOwnProperty("gen_time")) {
		if (argv.gen_time == null) {
			argv.gen_time = 240;
			console.log("did not specify gen-time, using default 240 seconds");
		}
	}
	
	var generator = require('./gen_data.js');
	generator.genData(connection, argv.gen_time);
	
	connection.end();
	process.exit();
}
else {
	//Setup Serial
	var SerialPort = require('serialport');
	
	var serialPort = new SerialPort(argv.serial_port, {
		baudRate: argv.baudrate
	});
	
	var fetcher = require('./fetch_data.js');
	
}

*/