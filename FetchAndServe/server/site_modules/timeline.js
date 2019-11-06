var db = require('../setup_modules/db');

function handleRefreshTimeline(queryNumber, socket) {
    //console.log(queryNumber); 
    if (socket.timeline.nQueryGoal == 0) {
        socket.timeline.nQueryGoal = queryNumber;
        socket.timeline.nQueries = 1;
    }
    if (socket.timeline.nQueries == socket.timeline.nQueryGoal) {
        socket.timeline.nQueryGoal = 0;
        socket.timeline.nQueries = 0;
        socket.emit('refresh-chart-timeline')
    }
    socket.timeline.nQueries++;
}

function onSocketInit(socket) {
    socket.timeline = {
        nQueries: 0,
        nQueryGoal: 0
    }
}

function onTimelineQuerys(socket) {

    socket.on('humidity-query-timeline', function(data){

        var datetimeDependence = "";

        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM humidity" + datetimeDependence;
        db.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
            }
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('humidity-resp-timeline', clientData);
            handleRefreshTimeline(data.queryNumber, socket);
        });
        //console.log("in humidity-query-timeline");
    });

    socket.on('pressure-query-timeline', function(data){


        var datetimeDependence = "";

        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM pressure" + datetimeDependence;
        db.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
            }
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('pressure-resp-timeline', clientData);
            handleRefreshTimeline(data.queryNumber, socket);
        });
        //console.log("in pressure-query-timeline");
    });

    socket.on('temperature-query-timeline', function(data){

        var datetimeDependence = "";

        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM temperature" + datetimeDependence;
        db.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
            }
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('temperature-resp-timeline', clientData);
            handleRefreshTimeline(data.queryNumber, socket);
        });
        //console.log("in temperature-query-timeline");
    });

    socket.on('rainfall-query-timeline', function(data){

        var datetimeDependence = "";

        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM rainfall" + datetimeDependence;
        db.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
            }
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('rainfall-resp-timeline', clientData);
            handleRefreshTimeline(data.queryNumber, socket);
        });
        //console.log("in rainfall-query-timeline");
    });

    socket.on('gust-query-timeline', function(data){

        var datetimeDependence = "";

        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM gust" + datetimeDependence;
        db.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
            }
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('gust-resp-timeline', clientData);
            handleRefreshTimeline(data.queryNumber, socket);
        });
        //console.log("in gust-query-timeline");
    });

    socket.on('wind-query-timeline', function(data){

        var datetimeDependence = "";

        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,wind,direction FROM wind" + datetimeDependence;
        db.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
            }
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].wind, rows[i].direction])
            }
            socket.emit('wind-resp-timeline', clientData);
            handleRefreshTimeline(data.queryNumber, socket);
        });
        //console.log("in wind-query-timeline");
    });

    socket.on('direction-query-timeline', function(data){

        var datetimeDependence = "";

        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,direction FROM wind" + datetimeDependence;
        db.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
            }
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].direction])
            }
            socket.emit('direction-resp-timeline', clientData);
            handleRefreshTimeline(data.queryNumber, socket);
        });
        //console.log("in direction-query-timeline");
    });

}

module.exports.onSocketInit = onSocketInit;
module.exports.onTimelineQuerys = onTimelineQuerys;