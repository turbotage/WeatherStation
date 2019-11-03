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

var timeline = require("./timeline");
var windrose = require("./windrose");

io.on('connection', function(socket){
    //socket.emit('server-refresh', {type: 1});
    console.log(socket.id)
    //console.log(socket.request.connection.remoteAddress);
    //console.log(socket.handshake.address);   
    //console.log(socket.request.connection.remoteAddress.split(":").pop());
    //TODO: change to
    // SELECT UNIX_TIMESTAMP(datetime)*1000 AS datetime,value FROM humidity 
    // WHERE datetime BETWEEN '2019-01-01 03:05:01' AND '2019-01-01 03:30:20'
    
    //server-client communications
    //server set socket specific properties
    //timeline properties

    timeline.onSocketInit(socket);
    windrose.onSocketInit(socket);

    //server-server communications
    timeline.onTimelineQuerys(socket, connection);
    windrose.onWindroseQuerys(socket, connection);


    socket.on('server-update-notice', function(data){
        console.log('Fetcher Was Here');
        var ipString = socket.request.connection.remoteAddress.split(":").pop();
        console.log(ipString);
        if ( (ipString == "192.168.1.168") || (ipString == "localhost") || (ipString == "127.0.0.1")) {
            console.log('Real fetcher was here');
        }   

    });

});