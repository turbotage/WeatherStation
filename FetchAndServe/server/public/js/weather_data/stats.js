
var stats = {
	year: {
		startDate: moment().format('YYYY') + '-01-01:00:00:01',
		endDate: moment().format('YYYY') + '-12-31:23:59:59'
	},
	month: {
		startDate: moment().format('YYYY-MM') + '-01',
		endDate: moment().add(2, 'M').format('YYYY-MM-DD'),
	},
	day: {
		startDate: moment().format('YYYY-MM-DD') + ':00:00:01',
		endDate: moment().add(1, 'M').format('YYYY-MM-DD') // can add infinite time doesn't matter
	},
}

socket.on('avg-stats-resp', function(data){
	//console.log(stats.stdMonth);
	//console.log(stats.stdDay);
	//console.log(data);
	if ((data.startDate == stats.year.startDate) && (data.endDate == stats.year.endDate) ) {
		if (data.humidity != null){
			$("#humidity-avg-year").prepend(data.humidity.toFixed(2));
		}
		if (data.pressure != null){
			$("#pressure-avg-year").prepend(data.pressure.toFixed(2));
		}
		if (data.rainfall != null){
			$("#rainfall-avg-year").prepend(data.rainfall.toFixed(2));
		}
		if (data.temperature != null){
			$("#temperature-avg-year").prepend(data.temperature.toFixed(2));
		}
		if (data.wind != null){
			$("#wind-avg-year").prepend(data.wind.toFixed(2));
		}
		if (data.gust != null){
			$("#gust-avg-year").prepend(data.gust.toFixed(2));
		}
	}
	else if ((data.startDate == stats.month.startDate) && (data.endDate == stats.month.endDate) ) {
		if (data.humidity != null){
			$("#humidity-avg-month").prepend(data.humidity.toFixed(2));
		}
		if (data.pressure != null){
			$("#pressure-avg-month").prepend(data.pressure.toFixed(2));
		}
		if (data.rainfall != null){
			$("#rainfall-avg-month").prepend(data.rainfall.toFixed(2));
		}
		if (data.temperature != null){
			$("#temperature-avg-month").prepend(data.temperature.toFixed(2));
		}
		if (data.wind != null){
			$("#wind-avg-month").prepend(data.wind.toFixed(2));
		}
		if (data.gust != null){
			$("#gust-avg-month").prepend(data.gust.toFixed(2));
		}
	}
	else if ((data.startDate == stats.day.startDate) && (data.endDate == stats.day.endDate) ) {
		if (data.humidity != null){
			$("#humidity-avg-day").prepend(data.humidity.toFixed(2));
		}
		if (data.pressure != null){
			$("#pressure-avg-day").prepend(data.pressure.toFixed(2));
		}
		if (data.rainfall != null){
			$("#rainfall-avg-day").prepend(data.rainfall.toFixed(2));
		}
		if (data.temperature != null){
			$("#temperature-avg-day").prepend(data.temperature.toFixed(2));
		}
		if (data.wind != null){
			$("#wind-avg-day").prepend(data.wind.toFixed(2));
		}
		if (data.gust != null){
			$("#gust-avg-day").prepend(data.gust.toFixed(2));
		}
	}

});

socket.on('std-stats-resp', function(data){
	//console.log(stats.stdMonth);
	//console.log(stats.stdDay);
	//console.log(data);
	if ((data.startDate == stats.year.startDate) && (data.endDate == stats.year.endDate) ) {
		if (data.humidity != null){
			$("#humidity-std-year").prepend(data.humidity.toFixed(2));
		}
		if (data.pressure != null){
			$("#pressure-std-year").prepend(data.pressure.toFixed(2));
		}
		if (data.rainfall != null){
			$("#rainfall-std-year").prepend(data.rainfall.toFixed(2));
		}
		if (data.temperature != null){
			$("#temperature-std-year").prepend(data.temperature.toFixed(2));
		}
		if (data.wind != null){
			$("#wind-std-year").prepend(data.wind.toFixed(2));
		}
		if (data.gust != null){
			$("#gust-std-year").prepend(data.gust.toFixed(2));
		}
	}
	else if ((data.startDate == stats.month.startDate) && (data.endDate == stats.month.endDate) ) {
		if (data.humidity != null){
			$("#humidity-std-month").prepend(data.humidity.toFixed(2));
		}
		if (data.pressure != null){
			$("#pressure-std-month").prepend(data.pressure.toFixed(2));
		}
		if (data.rainfall != null){
			$("#rainfall-std-month").prepend(data.rainfall.toFixed(2));
		}
		if (data.temperature != null){
			$("#temperature-std-month").prepend(data.temperature.toFixed(2));
		}
		if (data.wind != null){
			$("#wind-std-month").prepend(data.wind.toFixed(2));
		}
		if (data.gust != null){
			$("#gust-std-month").prepend(data.gust.toFixed(2));
		}
	}
	else if ((data.startDate == stats.day.startDate) && (data.endDate == stats.day.endDate) ) {
		if (data.humidity != null){
			$("#humidity-std-day").prepend(data.humidity.toFixed(2));
		}
		if (data.pressure != null){
			$("#pressure-std-day").prepend(data.pressure.toFixed(2));
		}
		if (data.rainfall != null){
			$("#rainfall-std-day").prepend(data.rainfall.toFixed(2));
		}
		if (data.temperature != null){
			$("#temperature-std-day").prepend(data.temperature.toFixed(2));
		}
		if (data.wind != null){
			$("#wind-std-day").prepend(data.wind.toFixed(2));
		}
		if (data.gust != null){
			$("#gust-std-day").prepend(data.gust.toFixed(2));
		}
	}
});

socket.on('max-stats-resp', function(data){
	//console.log(stats.stdMonth);
	//console.log(stats.stdDay);
	//console.log(data);
	if ((data.startDate == stats.year.startDate) && (data.endDate == stats.year.endDate) ) {
		if (data.humidity != null){
			$("#humidity-max-year").prepend(data.humidity.toFixed(2));
		}
		if (data.pressure != null){
			$("#pressure-max-year").prepend(data.pressure.toFixed(2));
		}
		if (data.rainfall != null){
			$("#rainfall-max-year").prepend(data.rainfall.toFixed(2));
		}
		if (data.temperature != null){
			$("#temperature-max-year").prepend(data.temperature.toFixed(2));
		}
		if (data.wind != null){
			$("#wind-max-year").prepend(data.wind.toFixed(2));
		}
		if (data.gust != null){
			$("#gust-max-year").prepend(data.gust.toFixed(2));
		}
	}
	else if ((data.startDate == stats.month.startDate) && (data.endDate == stats.month.endDate) ) {
		if (data.humidity != null){
			$("#humidity-max-month").prepend(data.humidity.toFixed(2));
		}
		if (data.pressure != null){
			$("#pressure-max-month").prepend(data.pressure.toFixed(2));
		}
		if (data.rainfall != null){
			$("#rainfall-max-month").prepend(data.rainfall.toFixed(2));
		}
		if (data.temperature != null){
			$("#temperature-max-month").prepend(data.temperature.toFixed(2));
		}
		if (data.wind != null){
			$("#wind-max-month").prepend(data.wind.toFixed(2));
		}
		if (data.gust != null){
			$("#gust-max-month").prepend(data.gust.toFixed(2));
		}
	}
	else if ((data.startDate == stats.day.startDate) && (data.endDate == stats.day.endDate) ) {
		if (data.humidity != null){
			$("#humidity-max-day").prepend(data.humidity.toFixed(2));
		}
		if (data.pressure != null){
			$("#pressure-max-day").prepend(data.pressure.toFixed(2));
		}
		if (data.rainfall != null){
			$("#rainfall-max-day").prepend(data.rainfall.toFixed(2));
		}
		if (data.temperature != null){
			$("#temperature-max-day").prepend(data.temperature.toFixed(2));
		}
		if (data.wind != null){
			$("#wind-max-day").prepend(data.wind.toFixed(2));
		}
		if (data.gust != null){
			$("#gust-max-day").prepend(data.gust.toFixed(2));
		}
	}
});

socket.on('min-stats-resp', function(data){
	//console.log(stats.stdMonth);
	//console.log(stats.stdDay);
	//console.log(data);
	if ((data.startDate == stats.year.startDate) && (data.endDate == stats.year.endDate) ) {
		if (data.humidity != null){
			$("#humidity-min-year").prepend(data.humidity.toFixed(2));
		}
		if (data.pressure != null){
			$("#pressure-min-year").prepend(data.pressure.toFixed(2));
		}
		if (data.rainfall != null){
			$("#rainfall-min-year").prepend(data.rainfall.toFixed(2));
		}
		if (data.temperature != null){
			$("#temperature-min-year").prepend(data.temperature.toFixed(2));
		}
		if (data.wind != null){
			$("#wind-min-year").prepend(data.wind.toFixed(2));
		}
		if (data.gust != null){
			$("#gust-min-year").prepend(data.gust.toFixed(2));
		}
	}
	else if ((data.startDate == stats.month.startDate) && (data.endDate == stats.month.endDate) ) {
		if (data.humidity != null){
			$("#humidity-min-month").prepend(data.humidity.toFixed(2));
		}
		if (data.pressure != null){
			$("#pressure-min-month").prepend(data.pressure.toFixed(2));
		}
		if (data.rainfall != null){
			$("#rainfall-min-month").prepend(data.rainfall.toFixed(2));
		}
		if (data.temperature != null){
			$("#temperature-min-month").prepend(data.temperature.toFixed(2));
		}
		if (data.wind != null){
			$("#wind-min-month").prepend(data.wind.toFixed(2));
		}
		if (data.gust != null){
			$("#gust-min-month").prepend(data.gust.toFixed(2));
		}
	}
	else if ((data.startDate == stats.day.startDate) && (data.endDate == stats.day.endDate) ) {
		if (data.humidity != null){
			$("#humidity-min-day").prepend(data.humidity.toFixed(2));
		}
		if (data.pressure != null){
			$("#pressure-min-day").prepend(data.pressure.toFixed(2));
		}
		if (data.rainfall != null){
			$("#rainfall-min-day").prepend(data.rainfall.toFixed(2));
		}
		if (data.temperature != null){
			$("#temperature-min-day").prepend(data.temperature.toFixed(2));
		}
		if (data.wind != null){
			$("#wind-min-day").prepend(data.wind.toFixed(2));
		}
		if (data.gust != null){
			$("#gust-min-day").prepend(data.gust.toFixed(2));
		}
	}

});

function queryUpdateAllStats() {
	socket.emit('avg-stats-query', stats.year);
	socket.emit('avg-stats-query', stats.month);
	socket.emit('avg-stats-query', stats.day);

	socket.emit('std-stats-query', stats.year);
	socket.emit('std-stats-query', stats.month);
	socket.emit('std-stats-query', stats.day);

	socket.emit('max-stats-query', stats.year);
	socket.emit('max-stats-query', stats.month);
	socket.emit('max-stats-query', stats.day);

	socket.emit('min-stats-query', stats.year);
	socket.emit('min-stats-query', stats.month);
	socket.emit('min-stats-query', stats.day);
}

$(document).ready(function(){
	queryUpdateAllStats();
});

