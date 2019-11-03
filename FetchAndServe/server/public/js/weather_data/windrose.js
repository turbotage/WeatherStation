
var windrose = {
    weatherData: {

    },
    chartOptions: {
    
        chart: {
            polar: true,
            type: 'column',
            showAxes: true,
            showEmpty: true
        },

        title: {
            text: 'Wind rose for Järnäsklubb 212'
        },

        subtitle: {
            text: ''
        },

        pane: {
            size: '85%'
        },

        legend: {
            reversed: true,
            align: 'right',
            verticalAlign: 'top',
            y: 100,
            layout: 'vertical'
        },

        xAxis: {
            //tickInterval: 1,
            categories: ["N","NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
            //min: 0,
            //max: 16,
            //showAxes: true,
            //showEmpty: true,
            //uniqieNames: true
        },

        yAxis: {
            min: 0,
            endOnTick: false,
            showLastLabel: true,
            title: {
                text: 'Frequency (%)'
            },
            labels: {
                formatter: function () {
                    return this.value + '%';
                }
            }
        },

        tooltip: {
            valueSuffix: '%',
            followPointer: true
        },

        plotOptions: {
            series: {
                stacking: 'normal',
                shadow: false,
                groupPadding: 0,
                pointPlacement: 'on'
            }
        },
        series: []
    },
    queryData: {
        queryNumber: 1
    },

}



$(document).ready(function(){
    console.log('on ready windrose');
    socket.emit('wind-query-windrose', windrose.queryData);
});


socket.on('wind-resp-windrose', function(data) {
    console.log('wind-resp-windrose');
    windrose.chartOptions.series = data;
    console.log(windrose.chartOptions);
});


socket.on('refresh-chart-windrose', function() {
    console.log('refresh-chart-windrose');
    //console.log(windrose.)
    windrose.chart = new Highcharts.chart('windrose-div', windrose.chartOptions);
});
