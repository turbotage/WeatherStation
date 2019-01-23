var dateFormat = require('dateformat'),
fs = require('fs'),
https = require('https'),
express = require('express');

var app = express();

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'secret',
	password: 'secret',
	database: 'secret'
});

connection.connect();

function weatherQuery(command, socket){
  var queryCommand1 = 'SELECT DATE_FORMAT(date, \'%Y-%m-%d\') AS date,value,time FROM ' + command.type + ' WHERE date BETWEEN \'' + command.startDate + '\' AND \''  + command.endDate + '\' ORDER BY date,time ASC';
  var query1 = connection.query(queryCommand1, function(err1, rows1, result1){
    if(err1) throw err1;
  	var serverData = {
			data1: [],
			data2: [],
			data3: [],
			type: command.type,
    	chart: command.chart
		}
  	var callbacksLeft = 0;
    for(var i = 0; i < rows1.length; i++){
      var string = rows1[i].date + "T" + rows1[i].time;
      serverData.data1.push({"x": string, "y":rows1[i].value});
    }
		var shouldCommitIn3 = false;
			if(command.type == 'wind_direction'){
				shouldCommitIn3 = true;
				var queryCommand2 = 'SELECT DATE_FORMAT(date, \'%Y-%m-%d\') AS date,value,time FROM ' + 'wind' + ' WHERE date BETWEEN \'' + command.startDate + '\' AND \''  + command.endDate + '\' ORDER BY date,time ASC';
				var query2 = connection.query(queryCommand2, function(err2, rows2, result2){
						if(err2) throw err2;
						for(var i = 0; i < rows2.length; i++){
								var string = rows2[i].date + "T" + rows2[i].time;
								serverData.data2.push({"x": string, "y": rows2[i].value});
							}
						var queryCommand3 = 'SELECT DATE_FORMAT(date, \'%Y-%m-%d\') AS date,value,time FROM ' + 'wind_max' + ' WHERE date BETWEEN \'' + command.startDate + '\' AND \''  + command.endDate + '\' ORDER BY date,time ASC';
						var query3 = connection.query(queryCommand3, function(err3, rows3, result3){
								if(err3) throw err3;
								for(var i = 0; i < rows3.length; i++){
									var string = rows3[i].date + "T" + rows3[i].time;
									serverData.data3.push({"x": string, "y": rows3[i].value});
								}
								socket.emit('serverData', serverData);
							});
					});
			}
			if(shouldCommitIn3 == false){
				socket.emit('serverData', serverData);
			}
  });
}

var port = 55555;
app.use(express.static('public'));

var app = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app);

io = require('socket.io').listen(app);
app.listen(port, "0.0.0.0");
console.log("listening on https://localhost:" + port);

io.sockets.on('connection', function(socket){
  console.log('New client: ' + socket.id);
  socket.on('clientData', function(data){
    var clientData = {
    	type: data.type,
    	startDate: data.startDate,
    	endDate: data.endDate,
    	chart: data.chart
    }
    var data = weatherQuery(clientData, socket);
  });
});