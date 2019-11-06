var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);

if (!argv.hasOwnProperty("db_host")) {
    if (argv.db_host == null) {
        console.log("did not specify database host name (--db_host)");
        process.exit();
    }
}

if (!argv.hasOwnProperty("db_user")) {
    if (argv.db_user == null) {
        console.log("did not specify database username (--db_user)");
        process.exit();
    }
}

if (!argv.hasOwnProperty("db_pass")) {
    if (argv.db_pass == null) {
        console.log("did not specify database password (--db_pass)");
        process.exit();
    }
}

if (!argv.hasOwnProperty("db_name")) {
    if (argv.db_name == null) {
        console.log("did not specify database name (--db_name)");
        process.exit();
    }
}

if (!argv.hasOwnProperty("serial_port")) {
    if (argv.serial_port == null) {
		argv.serial_port = "/dev/ttyACM0";
        console.log("did not specify serialport (--serial_port), using default /dev/ttyACM0");
    }
}

if (!argv.hasOwnProperty("baudrate")) {
    if (argv.baudrate == null) {
		argv.baudrate = 9600
        console.log("did not specify baudrate (--baudrate), using default 9600");
    }
}

if (!argv.hasOwnProperty("time")) {
	if (argv.time == null) {
		argv.time = 240;
		console.log("did not specify time to wait between fetches (--time), using default 240 seconds");
	}
}

module.exports = argv;