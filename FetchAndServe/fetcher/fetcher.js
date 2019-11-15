
var settings = require('./settings');

/**
function msleep(n) {
	 Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
function sleep(n) {
	msleep(n*1000);
}
*/

var rainCounter = 0;


var fetcher;

//callback is callback after updateGust except at raincycles when it is called after rainfall
function updateAll(callback) {
	fetcher.updateHumidity(function(){
		fetcher.updatePressure(function(){
			fetcher.updateTemperature(function(){
				fetcher.updateWind(function(){
					fetcher.updateGust(function(){
						rainCounter++;
						if (rainCounter == settings.rain_cycles){
							fetcher.updateRainfall(function(){
								callback();
							});
							rainCounter = 0;
						}
						else {
							callback();
						}
					})
				})
			})
		});
	});
}



if (settings.gen_data) {
	fetcher = require('./gen_data');
}
else {
	fetcher = require('./fetch_data');
}

setInterval(function(){
	updateAll(function(){
		console.log("successfull fetch and db insert");
	});
}, settings.time*1000);

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