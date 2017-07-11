
var dateFormat = require('dateformat');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'turbotage',
  password: 'stringtheorysucks3.14',
  database: 'WeatherStation'
});
connection.connect();


function handleSQL(data){
  var queryCommand = 'INSERT INTO ' + data.type + ' SET ?';
  var time = (dateFormat(new Date(), "HH-MM-ss").replace("-", ":")).replace("-", ":");
  var obj;
  if(data.type == 'rainfall'){
    obj = {date: dateFormat(new Date(), "yyyy-mm-dd"), value: data.value, time: time};
  }
  else{
    obj = {date: dateFormat(new Date(), "yyyy-mm-dd"), value: parseFloat(data.value), time: time};
  }
  var query = connection.query(queryCommand, obj, function(err, rows, result) {
    if(err) throw err;
  });
  console.log(query.sql);
}

var fs = require('fs');
function saveData(){
  var array = fs.readFileSync('tmp.dat').toString().split("\n");
  for(var i = 0; i < array.length; i += 2){
    var data = {
      type: array[i],
      value: array[i+1]
    };
    handleSQL(data);
  }
  fs.unlinkSync('tmp.dat', function(err, stats){
    if(err) throw err;
    console.log('deleted tmp.dat');
  });
}

var serialport = '/dev/ttyACM0';
var spawn = require('child_process').spawn;
var fetcher = spawn('./fetcher.sh', [serialport]);

fetcher.stdout.setEncoding('utf8');

fetcher.stdout.on('data', function(data) {
  var str = data.toString();
  console.log(data);
  if(str == "data_ready"){
    saveData();
  }
});

fetcher.on('close', function(code) {
  console.log('fetcher.sh exit code: ' + code);
});
