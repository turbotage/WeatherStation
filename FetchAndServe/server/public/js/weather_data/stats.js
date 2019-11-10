
var stats = {
	averageMonth: {
		startDate: moment().format('YYYY-MM') + '-01',
		endDate: moment().add(1, 'M').format('YYYY-MM-DD'),
	}
}

socket.on('average-stats-resp', function(data){
	console.log(stats.averageMonth);
	console.log(data);
	if ((data.startDate == stats.averageMonth.startDate) && (data.endDate == stats.averageMonth.endDate) ) {
		$("#humidity-avg-month").prepend(data.humidity.toFixed(2));
		$("#pressure-avg-month").prepend(data.pressure.toFixed(2));
		$("#rainfall-avg-month").prepend(data.rainfall.toFixed(2));
		$("#temperature-avg-month").prepend(data.temperature.toFixed(2));
		$("#wind-avg-month").prepend(data.wind.toFixed(2));
		$("#gust-avg-month").prepend(data.gust.toFixed(2));
	}
});

function queryUpdateAllAverage() {
	socket.emit('average-stats-query', stats.averageMonth);
}

$(document).ready(function(){
	queryUpdateAllAverage();
});