var settings = require('./settings');


var serialport = require('serialport');
var Readline = require('@serialport/parser-readline');

var port = new serialport(settings.serial_port, {
	baudRate: settings.baudrate,
});

var parser = port.pipe(new Readline({ delimiter: '\r\n'}));

var EventEmitter = require('events');
var wrapper = new EventEmitter();

var classifiers = {};

var lastTypeCmd = '';

parser.on('data', function(data) {
	try {
		for (var type in classifiers) {
			if (!classifiers.hasOwnProperty(type)) continue;

			if (classifiers[type](lastTypeCmd)) {
				wrapper.emit(type, data);
				break;
			}
		}
	} catch(e) {
		wrapper.emit('error', e);
	}
});

wrapper.addClassifier = function(type, callback) {
	classifiers[type] = callback;
};

wrapper.send = function(cmd, type) {
	lastTypeCmd = type;
	port.write(cmd);
}

wrapper.logClassifiers = function(data) {
	console.log(classifiers);
}

module.exports = wrapper;