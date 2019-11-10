var db = require('../setup_modules/db');

function onStatsQuerys(socket) {

	socket.on('average-stats-query', function(data) {

		var clientData = {
			startDate: data.startDate,
			endDate: data.endDate,
			humidity: 0,
			pressure: 0,
			rainfall: 0,
			temperature: 0,
			wind: 0,
			gust: 0,
			errorOn: []
		}
		//var acceptedWeatherTypes = ['humidity', 'pressure', 'rainfall', 'temperature', 'wind', 'gust'];

		var datetimeDependence = " WHERE datetime BETWEEN \'" + data.startDate + "\' AND \'" + data.endDate + "\'";

		var queryCmd = "SELECT AVG(value) FROM humidity" + datetimeDependence;
		db.query(queryCmd, function(err, rows, result) {
			if (err) throw err;
			//console.log(rows[0]['AVG(value)']);
			clientData.humidity = rows[0]['AVG(value)'];
			
			queryCmd = "SELECT AVG(value) FROM pressure" + datetimeDependence;
			db.query(queryCmd, function(err, rows, result) {
				if (err) throw err;
				//console.log(rows[0]['AVG(value)']);
				clientData.pressure = rows[0]['AVG(value)'];

				queryCmd = "SELECT AVG(value) FROM rainfall" + datetimeDependence;
				db.query(queryCmd, function(err, rows, result) {
					if (err) throw err;
					//console.log(rows[0]['AVG(value)']);
					clientData.rainfall = rows[0]['AVG(value)'];

					queryCmd = "SELECT AVG(value) FROM temperature" + datetimeDependence;
					db.query(queryCmd, function(err, rows, result) {
						if (err) throw err;
						//console.log(rows[0]['AVG(value)']);
						clientData.temperature = rows[0]['AVG(value)'];

						queryCmd = "SELECT AVG(wind) FROM wind" + datetimeDependence;
						db.query(queryCmd, function(err, rows, result) {
							if (err) throw err;
							//console.log(rows[0]['AVG(wind)']);
							clientData.wind = rows[0]['AVG(wind)'];

							queryCmd = "SELECT AVG(value) FROM gust" + datetimeDependence;
							db.query(queryCmd, function(err, rows, result) {
								if (err) throw err;
								//console.log(rows[0]['AVG(value)']);
								clientData.gust = rows[0]['AVG(value)'];

								socket.emit('average-stats-resp', clientData);
							});
						});
					});
				});
			});
		});
		
		
	});



}

module.exports.onStatsQuerys = onStatsQuerys;