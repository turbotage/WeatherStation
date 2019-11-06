var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);

if (!argv.hasOwnProperty("db_host")) {
    if (argv.db_host == null) {
        console.log("did not specify required database host name (--db_host)");
        process.exit();
    }
}

if (!argv.hasOwnProperty("db_user")) {
    if (argv.db_user == null) {
        console.log("did not specify required database username (--db_user)");
        process.exit();
    }
}

if (!argv.hasOwnProperty("db_pass")) {
    if (argv.db_pass == null) {
        console.log("did not specify required database password (--db_pass)");
        process.exit();
    }
}

if (!argv.hasOwnProperty("db_name")) {
    if (argv.db_name == null) {
        console.log("did not specify required database name (--db_name)");
        process.exit();
    }
}

if (!argv.hasOwnProperty("web_port")) {
	if (argv.db_name == null) {
		console.log("did not specify webserver port (--web-port), using default 3000");
		argv.web_port = 3000;
	}
}

module.exports = argv;