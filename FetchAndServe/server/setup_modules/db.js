var mysql = require('mysql');
var settings = require('./settings');
var connection;

function connectDatabase() {

	var config = {
		host: settings.db_host,
		user: settings.db_user,
		password: settings.db_pass,
		database: settings.db_name
	};

	function addDisconnectHandler(connection) {
		connection.on("error", function (error) {
			if (error instanceof Error) {
				if (error.code === "PROTOCOL_CONNECTION_LOST") {
					console.error(error.stack);
					console.log("Lost connection. Reconnecting...");
	
					connectDatabase();
				} else if (error.fatal) {
					throw error;
				}
			}
		});
	}


	connection = mysql.createConnection(config);
	addDisconnectHandler(connection);
	connection.connect();

    return connection;
}

module.exports = connectDatabase();