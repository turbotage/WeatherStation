//structs
var timeline = {
    extraChartOptions: {
		animateSeries: true,
	},
    chartOptions: {
        chart: {
            zoomType: 'x'
		},
		plotOptions: {
			series: {
				dataGrouping: {
					forced: true,
					enabled: true,
					units: [
						['minute', [1,2,5,10,20,30]],
						['hour', [1]],
						['day', [1]],
						['week', [1]],
						['month', [1]]
					]
				}
			}
		},
        title: {
            text: ''
        },
        tooltip: {
            shared: false,
		},
		time: {
			timezoneOffset: -60
		},
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Time'
            },
            offset: 40
        },
        yAxis: [
            { //Humidity
                labels: { format: '{value} %', style: { color: colors.humidity } },
                title: { text: '', style: { color: colors.humidity } },
                opposite: false,
                visible: true,
            },
            { //Pressure
                labels: { format: '{value} hPa', style: { color: colors.pressure } },
                title: { text: '', style: { color: colors.pressure } },
                opposite: false,
                visible: true,
            },
            { //Temperature
                labels: { format: '{value}°C', style: { color: colors.temperature } },
                title: { text: '', style: { color: colors.temperature } },
                opposite: false,
                visible: true,
            },
            { //Rainfall
                labels: { format: '{value} mm/h', style: { color: colors.rainfall } },
                title: { text: '', style: { color: colors.rainfall } },
                opposite: false,
                visible: true,
            },
            { //Wind
                labels: { format: '{value} m/s', style: { color: colors.wind } },
                title: { text: '', style: { color: colors.wind } },
                opposite: true,
                visible: true,
            },
            { //Gust
                labels: { format: '{value} m/s', style: { color: colors.gust } },
                title: { text: '', style: { color: colors.gust } },
                opposite: true,
                visible: true,
            },
            { //Direction
                labels: { format: '{value} °', style: { color: colors.direction } },
                title: { text: '', style: { color: colors.direction } },
                opposite: true,
                visible: true,
            },
            { //WindBarb
                labels: { enabled: false },
                visible: true,
            }
        ],
        series: []
    },
    queryData: {
		startDate: '',
		endDate: ''
	},
	queryNumber: 0,
	queryGoal: 0,
    weatherTypes: ['humidity', 'pressure', 'temperature', 'rainfall', 'wind', 'gust', 'direction', 'windbarb']
}

//functions (internal timeline)
function getWeatherTypeIndex(type) {
    for (var i = 0; i < timeline.weatherTypes.length; i++) {
        if (type == timeline.weatherTypes[i]) {
            return i;
        }
    }
    return -1;
}

/*
function hideYAxis(options, type) {
    var index = getWeatherTypeIndex(type);
    if (type > -1) {
        options.yAxis[index].visible = false;
    }
}

function showYAxis(options, type) {
    var index = getWeatherTypeIndex(type);
    if (type > -1) {
        options.yAxis[index].visible = true;
    }
}
*/

function handleRefreshTimeline() {
	//console.log("in handleRefreshTimeline");
	timeline.queryNumber++;
	//console.log(timeline.queryNumber);
	if (timeline.queryNumber == timeline.queryGoal){
		timeline.queryNumber = 0;
		timeline.queryGoal = 0;
		refreshChartTimeline();
	}
}

function popTimelineDataSeries(id) {
	//console.log("in pop series");
	//console.log(timeline.chartOptions.series);
	/*
	for (var i = 0; i < timeline.chartOptions.series.length; i++){
		if (timeline.chartOptions.series[i].name == name){
			timeline.chartOptions.series.splice(i,1);
			//console.log("found series to pop at:" + i);
			break;
		}
	}
	*/
	//console.log(timeline.chartOptions.series);
	seriesToRemove = timeline.chart.get(id);
	if (seriesToRemove != null) {
		seriesToRemove.remove(false);
	}
}

function pushTimelineDataSeries(series) {
	//console.log("in push");
	timeline.chart.addSeries(series, false);
	
}

//socket events

socket.on('humidity-resp-timeline', function(data){
    //console.log('humidity-resp-timeline');
    var weatherType = 'humidity';
    var dataSeries = {
		id: weatherType,
        name: 'Humidity',
        color: colors.humidity,
        type: 'spline',
        yAxis: getWeatherTypeIndex(weatherType),
		data: data.dataSeries,
        tooltip: {
            valueSuffix: ' %'
        },
        //hide: hideYAxis(timeline.chartOptions, weatherType),
        //show: showYAxis(timeline.chartOptions, weatherType)
    }
    popTimelineDataSeries(weatherType);
	pushTimelineDataSeries(dataSeries);
	handleRefreshTimeline();
});

socket.on('pressure-resp-timeline', function(data) {
    //console.log('pressure-resp-timeline');
    var weatherType = 'pressure';
    var dataSeries = {
		id: weatherType,
        name: 'Pressure',
        color: colors.pressure,
        type: 'spline',
        yAxis: getWeatherTypeIndex(weatherType),
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' hPa'
        },
	}
    popTimelineDataSeries(weatherType);
	pushTimelineDataSeries(dataSeries);
	handleRefreshTimeline();
});

socket.on('temperature-resp-timeline', function(data){
    //console.log('temp-resp-timeline');
    var weatherType = 'temperature';
    var dataSeries = {
		id: weatherType,
        name: 'Temperature',
        color: colors.temperature,
        type: 'spline',
        yAxis: getWeatherTypeIndex(weatherType),
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' °C'
        },
    }
    popTimelineDataSeries(weatherType);
	pushTimelineDataSeries(dataSeries);
	handleRefreshTimeline();
});

socket.on('rainfall-resp-timeline', function(data){
    //console.log('rainfall-resp-timeline');
    var weatherType = 'rainfall';
    var dataSeries = {
		id: weatherType,
        name: 'Rainfall',
        color: colors.rainfall,
        type: 'spline',
        yAxis: getWeatherTypeIndex(weatherType),
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' mm/h'
        },
    }
    popTimelineDataSeries(weatherType);
	pushTimelineDataSeries(dataSeries);
	handleRefreshTimeline();
});

socket.on('gust-resp-timeline', function(data){
    //console.log('gust-resp-timeline');
    var weatherType = 'gust';
    var dataSeries = {
		id: weatherType,
        name: 'Gust',
        color: colors.gust,
        type: 'spline',
        yAxis: getWeatherTypeIndex(weatherType),
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' m/s'
        },
    }
    popTimelineDataSeries(weatherType);
	pushTimelineDataSeries(dataSeries);
	handleRefreshTimeline();
});

socket.on('wind-resp-timeline', function(data){
    //console.log('wind-resp-timeline');
    var windBarType = 'windbarb';
    var windType = 'wind';
    var windBarSeries = {
		id: windBarType,
        name: 'WindBar',
        color: colors.wind,
        type: 'windbarb',
        yAxis: getWeatherTypeIndex(windBarType),
        yOffset: -20,
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' m/s'
        },
    }
    var windSeries = {
		id: windType,
        name: 'Wind',
        color: colors.wind,
        type: 'spline',
        yAxis: getWeatherTypeIndex(windType),
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' m/s'
        },
    }
    popTimelineDataSeries(windBarType);
    pushTimelineDataSeries(windBarSeries);

    popTimelineDataSeries(windType);
	pushTimelineDataSeries(windSeries);
	
	handleRefreshTimeline();
});

socket.on('direction-resp-timeline', function(data){
    //console.log('direction-resp-timeline');
    var weatherType = 'direction';
    var dataSeries = {
		id: weatherType,
        name: 'Direction',
        color: colors.direction,
        type: 'spline',
        yAxis: getWeatherTypeIndex(weatherType),
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' °'
        },
    }
    popTimelineDataSeries(weatherType);
	pushTimelineDataSeries(dataSeries);
	refreshChartTimeline();
});

socket.on('refresh-chart-timeline', function(data){
    //console.log('refresh-chart-timeline');
    //handleRefreshTimeline();
});


function refreshChartTimeline() {
	//console.log("in refreshChartTimeline");
	//console.log(timeline.chartOptions);
	$("#timeline-loading-logo").empty();
	//console.log("in refresh");
	timeline.chart.redraw(true);
}

function queryUpdateAllTimeline() {
	//start loading logo
	$("#timeline-loading-logo").append("<div class=\"spinner-border\" role=\"status\">"
		+ "<span class=\"sr-only\">Loading...</span></div>\"");

	
	timeline.queryNumber = 0;
	timeline.queryGoal = 7;
    //timeline.chartOptions.yAxis[getWeatherTypeIndex('humidity')].visible = true;
	socket.emit('humidity-query-timeline', timeline.queryData);
    //timeline.chartOptions.yAxis[getWeatherTypeIndex('pressure')].visible = true;
    socket.emit('pressure-query-timeline', timeline.queryData);
    //timeline.chartOptions.yAxis[getWeatherTypeIndex('temperature')].visible = true;
    socket.emit('temperature-query-timeline', timeline.queryData);
    //timeline.chartOptions.yAxis[getWeatherTypeIndex('rainfall')].visible = true;
    socket.emit('rainfall-query-timeline', timeline.queryData);
    //timeline.chartOptions.yAxis[getWeatherTypeIndex('wind')].visible = true;
    socket.emit('wind-query-timeline', timeline.queryData);
    //timeline.chartOptions.yAxis[getWeatherTypeIndex('gust')].visible = true;
    socket.emit('gust-query-timeline', timeline.queryData);
    //timeline.chartOptions.yAxis[getWeatherTypeIndex('direction')].visible = true;
	socket.emit('direction-query-timeline', timeline.queryData);
	
}

//on first load
$(document).ready(function(){
	timeline.chart = new Highcharts.chart('timeline-div', timeline.chartOptions);
	timeline.queryData.startDate = moment().format('YYYY-MM-DD') + ':00:00:01';
	timeline.queryData.endDate = moment().format('YYYY-MM-DD') + ':23:59:59';
	queryUpdateAllTimeline();
});

//datepicking stuff

$(function() {
	$('#daterange-timeline').daterangepicker({
		opens: 'left',
		autoUpdateInfo: false,
		startDate: moment().format('YYYY-MM-DD'),
		endDate: moment().format('YYYY-MM-DD'),
		locale: {
			format: 'YYYY-MM-DD'
		}
	}, function(start, end, label) {
		
	});
		
	$("#daterange-timeline").on('apply.daterangepicker', function(ev, picker) {
		//console.log( picker.startDate.format('YYYY-MM-DD') + " - " + picker.startDate.format('YYYY-MM-DD') );
		timeline.queryData.startDate = picker.startDate.format('YYYY-MM-DD') + ':00:00:01';
			//console.log(timeline.queryData.startDate);
		timeline.queryData.endDate = picker.endDate.format('YYYY-MM-DD') + ':23:59:59';
			//console.log(timeline.queryData.endDate);
		queryUpdateAllTimeline();
	});

});