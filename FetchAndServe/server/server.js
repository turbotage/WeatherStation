//example call node .\server.js --db_host localhost --db_user turbotage --db_pass klassuger --db_name weather


//mysql init

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

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: argv.db_host,
	user: argv.db_user,
	password: argv.db_pass,
    database: argv.db_name,
    //port: 8889
});

connection.connect();

//webserver init

var webserverPort = 3000;

var http = require('http');
var express = require('express');
var app = express();

var server = http.createServer(app);
// Pass a http.Server instance to the listen method
var io = require('socket.io').listen(server);

// The server should start listening
server.listen(webserverPort);

// Expose the public folder as static resources
app.use(express.static('public'));

console.log("listening on https://localhost:" + webserverPort);

var nQueryGoal = 0;
var nQueries = 0;

function handleRefresh(queryNumber, socket) {
    //console.log(queryNumber);
    if (nQueryGoal == 0) {
        nQueryGoal = queryNumber;
        nQueries = 1;
    }
    if (nQueries == nQueryGoal) {
        nQueryGoal = 0;
        nQueries = 0;
        socket.emit('refresh-chart')
    }
    nQueries++;
}

io.on('connection', function(socket){
    //console.log('New client: ' + socket.id);
    //socket.emit('server-refresh', {type: 1});

    //TODO: change to
    // SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM humidity 
    // WHERE datetime BETWEEN '2019-01-01 03:05:01' AND '2019-01-01 03:30:20'

    socket.on('humidity-query', function(data){
        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM humidity";
        connection.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
            }
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('humidity-resp', clientData);
            handleRefresh(data.queryNumber, socket);
        })
    });

    socket.on('pressure-query', function(data){
        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM pressure";
        connection.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
            }
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('pressure-resp', clientData);
            handleRefresh(data.queryNumber, socket);
        })
    });

    socket.on('temperature-query', function(data){
        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM temperature";
        connection.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
            }
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('temperature-resp', clientData);
            handleRefresh(data.queryNumber, socket);
        })
    });

    socket.on('rainfall-query', function(data){
        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM rainfall";
        connection.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
            }
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('rainfall-resp', clientData);
            handleRefresh(data.queryNumber, socket);
        })
    });

    socket.on('gust-query', function(data){
        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM gust";
        connection.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
            }
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].value])
            }
            socket.emit('gust-resp', clientData);
            handleRefresh(data.queryNumber, socket);
        })
    });

    socket.on('wind-query', function(data){
        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,wind,direction FROM wind";
        connection.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
            }
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].wind, rows[i].direction])
            }
            socket.emit('wind-resp', clientData);
            handleRefresh(data.queryNumber, socket);
        })
    });

    socket.on('direction-query', function(data){
        var queryCmd = "SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,direction FROM wind";
        connection.query(queryCmd, function(err, rows, result){
            if (err) throw err;
            var clientData = {
                dataSeries: []
            }
            for(var i = 0; i < rows.length; i++){
                clientData.dataSeries.push([rows[i].datetime, rows[i].direction])
            }
            socket.emit('direction-resp', clientData);
            handleRefresh(data.queryNumber, socket);
        })
    });

});