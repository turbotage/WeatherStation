var socket = io.connect('http://192.168.1.238:3000');

//structs
var weatherData = {
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

}

var colors = {
    humidity: '#0000ff',
    pressure: '#ff00ff',
    temperature: '#ff6600',
    rainfall: '#0066cc',
    wind: '#000000',
    gust: '#808080',
    direction: '#00ff00'
}


var yAxis = [
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
]

var chart;
var chartOptions = {
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
    yAxis: yAxis,
    series: []
}

var weatherTypes = ['humidity', 'pressure', 'temperature', 'rainfall', 'wind', 'gust', 'direction', 'windbarb'];

//functions
function getWeatherTypeIndex(type) {
    for (var i = 0; i < weatherTypes.length; i++) {
        if (type == weatherTypes[i]) {
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

var queryData = {
    queryNumber: 7
}

chartOptions.yAxis[getWeatherTypeIndex('humidity')].visible = true;
socket.emit('humidity-query', queryData);
chartOptions.yAxis[getWeatherTypeIndex('pressure')].visible = true;
socket.emit('pressure-query', queryData);
chartOptions.yAxis[getWeatherTypeIndex('temperature')].visible = true;
socket.emit('temperature-query', queryData);
chartOptions.yAxis[getWeatherTypeIndex('rainfall')].visible = true;
socket.emit('rainfall-query', queryData);
chartOptions.yAxis[getWeatherTypeIndex('wind')].visible = true;
socket.emit('wind-query', queryData);
chartOptions.yAxis[getWeatherTypeIndex('gust')].visible = true;
socket.emit('gust-query', queryData);
chartOptions.yAxis[getWeatherTypeIndex('direction')].visible = true;
socket.emit('direction-query', queryData);

//socket events

socket.on('humidity-resp', function(data){
    console.log('humidity-resp');
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
        hide: hideYAxis(chartOptions, weatherType),
        show: showYAxis(chartOptions, weatherType)
    }
    popDataSeries(chartOptions, weatherType);
    pushDataSeries(chartOptions, dataSeries);
});

socket.on('pressure-resp', function(data) {
    console.log('pressure-resp');
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
        hide: hideYAxis(chartOptions, weatherType),
        show: showYAxis(chartOptions, weatherType)
    }
    popDataSeries(chartOptions, weatherType);
    pushDataSeries(chartOptions, dataSeries);
});

socket.on('temperature-resp', function(data){
    console.log('temp-resp');
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
        hide: hideYAxis(chartOptions, weatherType),
        show: showYAxis(chartOptions, weatherType)
    }
    popDataSeries(chartOptions, weatherType);
    pushDataSeries(chartOptions, dataSeries);
});

socket.on('rainfall-resp', function(data){
    console.log('rainfall-resp');
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
        hide: hideYAxis(chartOptions, weatherType),
        show: showYAxis(chartOptions, weatherType)
    }
    popDataSeries(chartOptions, weatherType);
    pushDataSeries(chartOptions, dataSeries);
});

socket.on('gust-resp', function(data){
    console.log('gust-resp');
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
        hide: hideYAxis(chartOptions, weatherType),
        show: showYAxis(chartOptions, weatherType)
    }
    popDataSeries(chartOptions, weatherType);
    pushDataSeries(chartOptions, dataSeries);
});

socket.on('wind-resp', function(data){
    console.log('wind-resp');
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
        hide: hideYAxis(chartOptions, windBarType),
        show: showYAxis(chartOptions, windBarType)
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
        hide: hideYAxis(chartOptions, windType),
        show: showYAxis(chartOptions, windType)
    }
    popDataSeries(chartOptions, windBarType);
    pushDataSeries(chartOptions, windBarSeries);

    popDataSeries(chartOptions, windType);
    pushDataSeries(chartOptions, windSeries);
});

socket.on('direction-resp', function(data){
    console.log('direction-resp');
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
        hide: hideYAxis(chartOptions, weatherType),
        show: showYAxis(chartOptions, weatherType)
    }
    popDataSeries(chartOptions, weatherType);
    pushDataSeries(chartOptions, dataSeries);
});

socket.on('refresh-chart', function(data){
    console.log('refresh-chart');
    console.log(chartOptions);
    chart = new Highcharts.chart('graphdiv', chartOptions);
});



