//structs
var timeline = {
    weatherData: {
        
    },
    chartOptions: {
        chart: {
            zoomType: 'xy'
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
                visible: false,
            },
            { //Pressure
                labels: { format: '{value} hPa', style: { color: colors.pressure } },
                title: { text: '', style: { color: colors.pressure } },
                opposite: false,
                visible: false,
            },
            { //Temperature
                labels: { format: '{value}°C', style: { color: colors.temperature } },
                title: { text: '', style: { color: colors.temperature } },
                opposite: false,
                visible: false,
            },
            { //Rainfall
                labels: { format: '{value} mm/h', style: { color: colors.rainfall } },
                title: { text: '', style: { color: colors.rainfall } },
                opposite: false,
                visible: false,
            },
            { //Wind
                labels: { format: '{value} m/s', style: { color: colors.wind } },
                title: { text: '', style: { color: colors.wind } },
                opposite: true,
                visible: false,
            },
            { //Gust
                labels: { format: '{value} m/s', style: { color: colors.gust } },
                title: { text: '', style: { color: colors.gust } },
                opposite: true,
                visible: false,
            },
            { //Direction
                labels: { format: '{value} °', style: { color: colors.direction } },
                title: { text: '', style: { color: colors.direction } },
                opposite: true,
                visible: false,
            },
            { //WindBarb
                labels: { enabled: false },
                visible: false,
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

function popTimelineDataSeries(name) {
	//console.log("in pop series");
	//console.log(timeline.chartOptions.series);
	for (var i = 0; i < timeline.chartOptions.series.length; i++){
		if (timeline.chartOptions.series[i].name == name){
			timeline.chartOptions.series.splice(i,1);
			//console.log("found series to pop at:" + i);
			break;
		}
	}
	//console.log(timeline.chartOptions.series);
}

function pushTimelineDataSeries(series) {
    timeline.chartOptions.series.push(series);
}

//socket events

socket.on('humidity-resp-timeline', function(data){
    //console.log('humidity-resp-timeline');
    var weatherType = 'humidity';
    var dataSeries = {
        name: 'Humidity',
        color: colors.humidity,
        type: 'spline',
        yAxis: getWeatherTypeIndex(weatherType),
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' %'
        },
        hide: hideYAxis(timeline.chartOptions, weatherType),
        show: showYAxis(timeline.chartOptions, weatherType)
    }
    popTimelineDataSeries(dataSeries.name);
	pushTimelineDataSeries(dataSeries);
	handleRefreshTimeline();
});

socket.on('pressure-resp-timeline', function(data) {
    //console.log('pressure-resp-timeline');
    var weatherType = 'pressure';
    var dataSeries = {
        name: 'Pressure',
        color: colors.pressure,
        type: 'spline',
        yAxis: getWeatherTypeIndex(weatherType),
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' hPa'
        },
        hide: hideYAxis(timeline.chartOptions, weatherType),
        show: showYAxis(timeline.chartOptions, weatherType)
	}
    popTimelineDataSeries(dataSeries.name);
	pushTimelineDataSeries(dataSeries);
	handleRefreshTimeline();
});

socket.on('temperature-resp-timeline', function(data){
    //console.log('temp-resp-timeline');
    var weatherType = 'temperature';
    var dataSeries = {
        name: 'Temperature',
        color: colors.temperature,
        type: 'spline',
        yAxis: getWeatherTypeIndex(weatherType),
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' °C'
        },
        hide: hideYAxis(timeline.chartOptions, weatherType),
        show: showYAxis(timeline.chartOptions, weatherType)
    }
    popTimelineDataSeries(dataSeries.name);
	pushTimelineDataSeries(dataSeries);
	handleRefreshTimeline();
});

socket.on('rainfall-resp-timeline', function(data){
    //console.log('rainfall-resp-timeline');
    var weatherType = 'rainfall';
    var dataSeries = {
        name: 'Rainfall',
        color: colors.rainfall,
        type: 'spline',
        yAxis: getWeatherTypeIndex(weatherType),
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' mm/h'
        },
        hide: hideYAxis(timeline.chartOptions, weatherType),
        show: showYAxis(timeline.chartOptions, weatherType)
    }
    popTimelineDataSeries(dataSeries.name);
	pushTimelineDataSeries(dataSeries);
	handleRefreshTimeline();
});

socket.on('gust-resp-timeline', function(data){
    //console.log('gust-resp-timeline');
    var weatherType = 'gust';
    var dataSeries = {
        name: 'Gust',
        color: colors.gust,
        type: 'spline',
        yAxis: getWeatherTypeIndex(weatherType),
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' m/s'
        },
        hide: hideYAxis(timeline.chartOptions, weatherType),
        show: showYAxis(timeline.chartOptions, weatherType)
    }
    popTimelineDataSeries(dataSeries.name);
	pushTimelineDataSeries(dataSeries);
	handleRefreshTimeline();
});

socket.on('wind-resp-timeline', function(data){
    //console.log('wind-resp-timeline');
    var windBarType = 'windbarb';
    var windType = 'wind';
    var windBarSeries = {
        name: 'WindBar',
        color: colors.wind,
        type: 'windbarb',
        yAxis: getWeatherTypeIndex(windBarType),
        yOffset: -20,
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' m/s'
        },
        hide: hideYAxis(timeline.chartOptions, windBarType),
        show: showYAxis(timeline.chartOptions, windBarType)
    }
    var windSeries = {
        name: 'Wind',
        color: colors.wind,
        type: 'spline',
        yAxis: getWeatherTypeIndex(windType),
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' m/s'
        },
        hide: hideYAxis(timeline.chartOptions, windType),
        show: showYAxis(timeline.chartOptions, windType)
    }
    popTimelineDataSeries(windBarSeries.name);
    pushTimelineDataSeries(windBarSeries);

    popTimelineDataSeries(windSeries.name);
	pushTimelineDataSeries(windSeries);
	
	handleRefreshTimeline();
});

socket.on('direction-resp-timeline', function(data){
    //console.log('direction-resp-timeline');
    var weatherType = 'direction';
    var dataSeries = {
        name: 'Direction',
        color: colors.direction,
        type: 'spline',
        yAxis: getWeatherTypeIndex(weatherType),
        data: data.dataSeries,
        tooltip: {
            valueSuffix: ' °'
        },
        hide: hideYAxis(timeline.chartOptions, weatherType),
        show: showYAxis(timeline.chartOptions, weatherType)
    }
    popTimelineDataSeries(dataSeries.name);
	pushTimelineDataSeries(dataSeries);
	refreshChartTimeline();
});


socket.on('refresh-chart-timeline', function(data){
    //console.log('refresh-chart-timeline');
    handleRefreshTimeline();
});




function refreshChartTimeline() {
	//console.log("in refreshChartTimeline");
	//console.log(timeline.chartOptions);
	$("#timeline-loading-logo").empty();
	timeline.chart = new Highcharts.chart('timeline-div', timeline.chartOptions);
}

function queryUpdateAllTimeline() {
	//start loading logo
	$("#timeline-loading-logo").append("<div class=\"spinner-border\" role=\"status\">"
		+ "<span class=\"sr-only\">Loading...</span></div>\"");

	
	timeline.queryNumber = 0;
	timeline.queryGoal = 7;
    timeline.chartOptions.yAxis[getWeatherTypeIndex('humidity')].visible = true;
    socket.emit('humidity-query-timeline', timeline.queryData);
    timeline.chartOptions.yAxis[getWeatherTypeIndex('pressure')].visible = true;
    socket.emit('pressure-query-timeline', timeline.queryData);
    timeline.chartOptions.yAxis[getWeatherTypeIndex('temperature')].visible = true;
    socket.emit('temperature-query-timeline', timeline.queryData);
    timeline.chartOptions.yAxis[getWeatherTypeIndex('rainfall')].visible = true;
    socket.emit('rainfall-query-timeline', timeline.queryData);
    timeline.chartOptions.yAxis[getWeatherTypeIndex('wind')].visible = true;
    socket.emit('wind-query-timeline', timeline.queryData);
    timeline.chartOptions.yAxis[getWeatherTypeIndex('gust')].visible = true;
    socket.emit('gust-query-timeline', timeline.queryData);
    timeline.chartOptions.yAxis[getWeatherTypeIndex('direction')].visible = true;
    socket.emit('direction-query-timeline', timeline.queryData);
}

//on first load
$(document).ready(function(){
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
		timeline.queryData.startDate = picker.startDate.format('YYYY-MM-DD') + ':00:00:01';
		console.log(timeline.queryData.startDate);
		timeline.queryData.endDate = picker.endDate.format('YYYY-MM-DD') + ':23:59:59';
		console.log(timeline.queryData.endDate);
		queryUpdateAllTimeline();
	});

});