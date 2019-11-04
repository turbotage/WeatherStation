var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);

if (!argv.hasOwnProperty("db_host")) {
    if (argv.db_host == null) {
        console.log("did not specify database host name");
        process.exit();
    }
}

if (!argv.hasOwnProperty("db_user")) {
    if (argv.db_user == null) {
        console.log("did not specify database user name");
        process.exit();
    }
}

if (!argv.hasOwnProperty("db_pass")) {
    if (argv.db_pass == null) {
        console.log("did not specify database password");
        process.exit();
    }
}

if (!argv.hasOwnProperty("db_name")) {
    if (argv.db_name == null) {
        console.log("did not specify database name");
        process.exit();
    }
}

if (!argv.hasOwnProperty("serial_port")) {
    if (argv.serial_port == null) {
		argv.serial_port = "/dev/ttyACM0";
        console.log("did not specify serialport, using default /dev/ttyACM0");
    }
}

if (!argv.hasOwnProperty("baudrate")) {
    if (argv.baudrate == null) {
		argv.baudrate = 9600
        console.log("did not specify baudrate, using default 9600");
    }
}

//Setup MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: argv.db_host,
	user: argv.db_user,
	password: argv.db_pass,
    database: argv.db_name,
    //port: 8889
});

connection.connect();

if (!argv.hasOwnProperty("gen_data")) {
	if (argv.gen_data != null){
		var dataGenerator = require('./gen_data.js');

		if (!argv.hasOwnProperty("gen_time")) {
			if (argv.gen_time == null) {
				argv.gen_time = 240;
				console.log("did not specify gen-time, using default 240 seconds");
			}
		}
		
		dataGenerator.genData(connection, argv.gem_time);
		process.exit();
	}
}

//Setup Serial
var SerialPort = require('serialport');

var serialPort = new SerialPort(argv.serial_port, {
    baudrate: argv.baudrate
});


function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
	while (true) {

	}
}

run();