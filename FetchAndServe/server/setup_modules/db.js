var mysql = require('mysql');
var settings = require('./settings');
var connection;

function connectDatabase() {

    function addDisconnectHandler(connection) {
        connection.on("error", function (error) {
            if (error instanceof Error) {
                if (error.code === "PROTOCOL_CONNECTION_LOST") {
                    console.error(error.stack);
                    console.log("Lost connection. Reconnecting...");

                    initializeConnection(connection.config);
                } else if (error.fatal) {
                    throw error;
                }
            }
        });
    }

	if(!connection) {

		var config = {
			host: settings.db_host,
			user: settings.db_user,
			password: settings.db_pass,
			database: settings.db_name
		};

		connection = mysql.createConnection(config);
		// Add handlers.
		addDisconnectHandler(connection);

		connection.connect();
	}

    return connection;
}

module.exports = connectDatabase();