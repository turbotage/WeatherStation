var db = require('../setup_modules/db');

function onTimelineQuerys(socket) {

    socket.on('humidity-query-timeline', function(data){
		
		var datetimeDependence = " WHERE datetime BETWEEN \'" + data.startDate + "\' AND \'" + data.endDate + "\'";

		var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM humidity" + datetimeDependence;
		//console.log(queryCmd);
        db.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
			}
			//console.log(rows.length);
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('humidity-resp-timeline', clientData);
        });
        //console.log("in humidity-query-timeline");
    });

    socket.on('pressure-query-timeline', function(data){

        var datetimeDependence = " WHERE datetime BETWEEN \'" + data.startDate + "\' AND \'" + data.endDate + "\'";

        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM pressure" + datetimeDependence;
        db.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
			}
			//console.log(rows.length);
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('pressure-resp-timeline', clientData);
        });
        //console.log("in pressure-query-timeline");
    });

    socket.on('temperature-query-timeline', function(data){

        var datetimeDependence = " WHERE datetime BETWEEN \'" + data.startDate + "\' AND \'" + data.endDate + "\'";

        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM temperature" + datetimeDependence;
        db.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
			}
			//console.log(rows.length);
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('temperature-resp-timeline', clientData);
        });
        //console.log("in temperature-query-timeline");
    });

    socket.on('rainfall-query-timeline', function(data){

        var datetimeDependence = " WHERE datetime BETWEEN \'" + data.startDate + "\' AND \'" + data.endDate + "\'";

        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM rainfall" + datetimeDependence;
        db.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
			}
			//console.log(rows.length);
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('rainfall-resp-timeline', clientData);
        });
        //console.log("in rainfall-query-timeline");
    });

    socket.on('gust-query-timeline', function(data){

        var datetimeDependence = " WHERE datetime BETWEEN \'" + data.startDate + "\' AND \'" + data.endDate + "\'";

        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM gust" + datetimeDependence;
        db.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
			}
			//console.log(rows.length);
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('gust-resp-timeline', clientData);
        });
        //console.log("in gust-query-timeline");
    });

    socket.on('wind-query-timeline', function(data){

        var datetimeDependence = " WHERE datetime BETWEEN \'" + data.startDate + "\' AND \'" + data.endDate + "\'";

        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,wind,direction FROM wind" + datetimeDependence;
        db.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
			}
			//console.log(rows.length);
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].wind, rows[i].direction])
            }
            socket.emit('wind-resp-timeline', clientData);
        });
        //console.log("in wind-query-timeline");
    });

    socket.on('direction-query-timeline', function(data){

        var datetimeDependence = " WHERE datetime BETWEEN \'" + data.startDate + "\' AND \'" + data.endDate + "\'";

        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,direction FROM wind" + datetimeDependence;
        db.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
			}
			//console.log(rows.length);
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].direction])
            }
            socket.emit('direction-resp-timeline', clientData);
        });
        //console.log("in direction-query-timeline");
    });

}

module.exports.onTimelineQuerys = onTimelineQuerys;