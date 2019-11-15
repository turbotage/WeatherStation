var db = require('../setup_modules/db');

function onStatsQuerys(socket) {

	socket.on('avg-stats-query', function(data) {

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

								socket.emit('avg-stats-resp', clientData);
							});
						});
					});
				});
			});
		});
		
		
	});

	socket.on('std-stats-query', function(data) {

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

		var queryCmd = "SELECT STDDEV_POP(value) FROM humidity" + datetimeDependence;
		db.query(queryCmd, function(err, rows, result) {
			if (err) throw err;
			//console.log(rows[0]['AVG(value)']);
			clientData.humidity = rows[0]['STDDEV_POP(value)'];
			
			queryCmd = "SELECT STDDEV_POP(value) FROM pressure" + datetimeDependence;
			db.query(queryCmd, function(err, rows, result) {
				if (err) throw err;
				//console.log(rows[0]['AVG(value)']);
				clientData.pressure = rows[0]['STDDEV_POP(value)'];

				queryCmd = "SELECT STDDEV_POP(value) FROM rainfall" + datetimeDependence;
				db.query(queryCmd, function(err, rows, result) {
					if (err) throw err;
					//console.log(rows[0]['AVG(value)']);
					clientData.rainfall = rows[0]['STDDEV_POP(value)'];

					queryCmd = "SELECT STDDEV_POP(value) FROM temperature" + datetimeDependence;
					db.query(queryCmd, function(err, rows, result) {
						if (err) throw err;
						//console.log(rows[0]['AVG(value)']);
						clientData.temperature = rows[0]['STDDEV_POP(value)'];

						queryCmd = "SELECT STDDEV_POP(wind) FROM wind" + datetimeDependence;
						db.query(queryCmd, function(err, rows, result) {
							if (err) throw err;
							//console.log(rows[0]['AVG(wind)']);
							clientData.wind = rows[0]['STDDEV_POP(wind)'];

							queryCmd = "SELECT STDDEV_POP(value) FROM gust" + datetimeDependence;
							db.query(queryCmd, function(err, rows, result) {
								if (err) throw err;
								//console.log(rows[0]['AVG(value)']);
								clientData.gust = rows[0]['STDDEV_POP(value)'];

								socket.emit('std-stats-resp', clientData);
							});
						});
					});
				});
			});
		});
		
		
	});

	socket.on('max-stats-query', function(data) {
		//console.log("max stats query");
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

		var queryCmd = "SELECT MAX(value) FROM humidity" + datetimeDependence;
		db.query(queryCmd, function(err, rows, result) {
			if (err) throw err;
			//console.log(rows[0]['MAX(value)']);
			clientData.humidity = rows[0]['MAX(value)'];
			
			queryCmd = "SELECT MAX(value) FROM pressure" + datetimeDependence;
			db.query(queryCmd, function(err, rows, result) {
				if (err) throw err;
				//console.log(rows[0]['MAX(value)']);
				clientData.pressure = rows[0]['MAX(value)'];

				queryCmd = "SELECT MAX(value) FROM rainfall" + datetimeDependence;
				db.query(queryCmd, function(err, rows, result) {
					if (err) throw err;
					//console.log(rows[0]['MAX(value)']);
					clientData.rainfall = rows[0]['MAX(value)'];

					queryCmd = "SELECT MAX(value) FROM temperature" + datetimeDependence;
					db.query(queryCmd, function(err, rows, result) {
						if (err) throw err;
						//console.log(rows[0]['MAX(value)']);
						clientData.temperature = rows[0]['MAX(value)'];

						queryCmd = "SELECT MAX(wind) FROM wind" + datetimeDependence;
						db.query(queryCmd, function(err, rows, result) {
							if (err) throw err;
							//console.log(rows[0]['MAX(wind)']);
							clientData.wind = rows[0]['MAX(wind)'];

							queryCmd = "SELECT MAX(value) FROM gust" + datetimeDependence;
							db.query(queryCmd, function(err, rows, result) {
								if (err) throw err;
								//console.log(rows[0]['MAX(value)']);
								clientData.gust = rows[0]['MAX(value)'];

								socket.emit('max-stats-resp', clientData);
							});
						});
					});
				});
			});
		});
		
		
	});

	socket.on('min-stats-query', function(data) {
		//console.log("min stats query");
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

		var queryCmd = "SELECT MIN(value) FROM humidity" + datetimeDependence;
		db.query(queryCmd, function(err, rows, result) {
			if (err) throw err;
			//console.log(rows[0]['AVG(value)']);
			clientData.humidity = rows[0]['MIN(value)'];
			
			queryCmd = "SELECT MIN(value) FROM pressure" + datetimeDependence;
			db.query(queryCmd, function(err, rows, result) {
				if (err) throw err;
				//console.log(rows[0]['AVG(value)']);
				clientData.pressure = rows[0]['MIN(value)'];

				queryCmd = "SELECT MIN(value) FROM rainfall" + datetimeDependence;
				db.query(queryCmd, function(err, rows, result) {
					if (err) throw err;
					//console.log(rows[0]['AVG(value)']);
					clientData.rainfall = rows[0]['MIN(value)'];

					queryCmd = "SELECT MIN(value) FROM temperature" + datetimeDependence;
					db.query(queryCmd, function(err, rows, result) {
						if (err) throw err;
						//console.log(rows[0]['AVG(value)']);
						clientData.temperature = rows[0]['MIN(value)'];

						queryCmd = "SELECT MIN(wind) FROM wind" + datetimeDependence;
						db.query(queryCmd, function(err, rows, result) {
							if (err) throw err;
							//console.log(rows[0]['AVG(wind)']);
							clientData.wind = rows[0]['MIN(wind)'];

							queryCmd = "SELECT MIN(value) FROM gust" + datetimeDependence;
							db.query(queryCmd, function(err, rows, result) {
								if (err) throw err;
								//console.log(rows[0]['AVG(value)']);
								clientData.gust = rows[0]['MIN(value)'];

								socket.emit('min-stats-resp', clientData);
							});
						});
					});
				});
			});
		});
		
		
	});

}

module.exports.onStatsQuerys = onStatsQuerys;