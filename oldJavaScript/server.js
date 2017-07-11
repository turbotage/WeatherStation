

var dateFormat = require('dateformat');

var today = new Date();
var tomorrow = new Date();
var rule = new schedule.RecurrenceRule();

var hasWritten = false;

var typeBools = [false, false, false, false, false, false, false];
var typeStrings = ["humidity", "pressure", "rainfall", "temperature", "wind_direction", "wind_max", "wind"];

function saveData(data){
  var place = 0;
  for(var i = 0; i < typeBools.length; i++){
    if(typeBools[i] == true){
      place = i;
    }
  }
  var queryCommand = 'INSERT INTO ' + typeStrings[place] + ' SET ?';
  var time = (dateFormat(new Date(), "HH-MM-ss").replace("-", ":")).replace("-", ":");
  var obj = {date: dateFormat(today, "yyyy-mm-dd"), value: parseFloat(data), time: time};
  console.log("Will query with command: " + queryCommand);
  console.log("Will query with data: " + obj);
  databaseQuery(queryCommand, obj);
  typeBools[place] = false;
}


var mysql = require('mysql');
var connection = mysql.createConnection({
  host: '192.168.1.177',
  user: 'turbotage',
  password: 'stringtheorysucks3.14',
  database: 'WeatherStation'
});

connection.connect();

function databaseQuery(queryCommand, data){
  var query = connection.query(queryCommand, data, function(err, result){
    if(err) throw err;
  });
  console.log(query.sql);
}

function weatherQuery(command, socket){
  var queryCommand = 'SELECT DATE_FORMAT(date, \'%Y-%m-%d\') AS date,value,time FROM ' + command.type + ' WHERE date BETWEEN \'' + command.startDate + '\' AND \''  + command.endDate + '\' ORDER BY date,time ASC';
  var query = connection.query(queryCommand, function(err, rows, result){
    if(err) throw err;
    var str = '';
    var data = [];
    for(var i = 0; i < rows.length; i++){
      var string = rows[i].date + "T" + rows[i].time;
      data.push({"x": string, "y":rows[i].value});
    }
    socket.emit('serverData', data);
  });
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var fs = require('fs'),
https = require('https'),
express = require('express');
var app = express();

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(55555);

app.use(express.static('public'));

rl.on('line', (input) => {
  hasWritten = true;
});

var io = require('socket.io')(server);

io.sockets.on('connection', function(socket){
  console.log('New client: ' + socket.id);
  socket.on('clientData', function(data){
    var clientData = {
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate
    }
    var data = weatherQuery(clientData, socket);
  });
});
