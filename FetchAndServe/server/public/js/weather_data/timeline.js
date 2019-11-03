//structs
var timeline = {
    weatherData: {
        humidityChanged: false,
        humidityStartDate: '2018-01-01 00:00:01',
        humidityEndDate: '2019-01-01 00:00:01',
        humidity: [],
    
        pressureChanged: false,
        pressureStartDate: '2018-01-01 00:00:01',
        pressureEndDate: '2019-01-01 00:00:01',
        pressure: [],
    
        temperatureChanged: false,
        temperatureStartDate: '2018-01-01 00:00:01',
        temperatureEndDate: '2019-01-01 00:00:01',
        temperature: [],
    
        rainfallChanged: false,
        rainfallStartDate: '2018-01-01 00:00:01',
        rainfallEndDate: '2019-01-01 00:00:01',
        rainfall: [],
    
        windChanged: false,
        windStartDate: '2018-01-01 00:00:01',
        windEndDate: '2019-01-01 00:00:01',
        wind: [],
    
        gustChanged: false,
        gustStartDate: '2018-01-01 00:00:01',
        gustEndDate: '2019-01-01 00:00:01',
        gust: [],
    
        directionChanged: false,
        directionStartDate: '2018-01-01 00:00:01',
        directionEndDate: '2019-01-01 00:00:01',
        direction: [],
    },
    chartOptions: {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Weather Data'
        },
        tooltip: {
            shared: false,
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
        queryNumber: 7
    },
    weatherTypes: ['humidity', 'pressure', 'temperature', 'rainfall', 'wind', 'gust', 'direction', 'windbarb']
}

//functions
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

function popDataSeries(options, type) {
    var index = options.series.indexOf(type);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function pushDataSeries(options, dataSeries) {
    options.series.push(dataSeries);
}

//onload
//console.log('onload');
//console.log(chartOptions);

$(document).ready(function(){
    console.log("on ready timeline");
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
});

//socket events

socket.on('humidity-resp-timeline', function(data){
    console.log('humidity-resp-timeline');
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
    popDataSeries(timeline.chartOptions, weatherType);
    pushDataSeries(timeline.chartOptions, dataSeries);
});

socket.on('pressure-resp-timeline', function(data) {
    console.log('pressure-resp-timeline');
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
    popDataSeries(timeline.chartOptions, weatherType);
    pushDataSeries(timeline.chartOptions, dataSeries);
});

socket.on('temperature-resp-timeline', function(data){
    console.log('temp-resp-timeline');
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
    popDataSeries(timeline.chartOptions, weatherType);
    pushDataSeries(timeline.chartOptions, dataSeries);
});

socket.on('rainfall-resp-timeline', function(data){
    console.log('rainfall-resp-timeline');
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
    popDataSeries(timeline.chartOptions, weatherType);
    pushDataSeries(timeline.chartOptions, dataSeries);
});

socket.on('gust-resp-timeline', function(data){
    console.log('gust-resp-timeline');
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
    popDataSeries(timeline.chartOptions, weatherType);
    pushDataSeries(timeline.chartOptions, dataSeries);
});

socket.on('wind-resp-timeline', function(data){
    console.log('wind-resp-timeline');
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
    popDataSeries(timeline.chartOptions, windBarType);
    pushDataSeries(timeline.chartOptions, windBarSeries);

    popDataSeries(timeline.chartOptions, windType);
    pushDataSeries(timeline.chartOptions, windSeries);
});

socket.on('direction-resp-timeline', function(data){
    console.log('direction-resp-timeline');
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
    popDataSeries(timeline.chartOptions, weatherType);
    pushDataSeries(timeline.chartOptions, dataSeries);
});

socket.on('refresh-chart-timeline', function(data){
    console.log('refresh-chart-timeline');
    //console.log(chartOptions);
    timeline.chart = new Highcharts.chart('timeline-div', timeline.chartOptions);
    //console.log(timeline.chartOptions);
});



