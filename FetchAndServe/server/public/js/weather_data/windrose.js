
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
            text: ''
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
                text: ''
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
		startDate: moment().format('YYYY-MM-DD') + ':00:00:01',
		endDate: moment().format('YYYY-MM-DD') + ':23:59:59'
    },

}

socket.on('wind-resp-windrose', function(data) {
    //console.log('wind-resp-windrose');
    windrose.chartOptions.series = data;
	refreshChartWindrose();
});

function queryUpdateWindrose() {
	$("#windrose-loading-logo").append("<div class=\"spinner-border\" role=\"status\">"
		+ "<span class=\"sr-only\">Loading...</span></div>\"");

	socket.emit('wind-query-windrose', windrose.queryData);
}

function refreshChartWindrose() {
	//console.log("in refreshChartTimeline");
	//console.log(timeline.chartOptions);
	$("#windrose-loading-logo").empty();
	windrose.chart = new Highcharts.chart('windrose-div', windrose.chartOptions);
}

$(document).ready(function(){
    //console.log('on ready windrose');
    queryUpdateWindrose();
});



$(function() {
	$('#daterange-windrose').daterangepicker({
		opens: 'left',
		autoUpdateInfo: false,
		startDate: moment().format('YYYY-MM-DD'),
		endDate: moment().format('YYYY-MM-DD'),
		locale: {
			format: 'YYYY-MM-DD'
		}
	}, function(start, end, label) {
		
	});
		
	$("#daterange-windrose").on('apply.daterangepicker', function(ev, picker) {
		//console.log(picker.startDate.format('YYYY-MM-DD') + "  -  " + picker.endDate.format('YYYY-MM-DD'));
		windrose.queryData.startDate = picker.startDate.format('YYYY-MM-DD') + ':00:00:01';
		console.log(windrose.queryData.startDate);
		windrose.queryData.endDate = picker.endDate.format('YYYY-MM-DD') + ':23:59:59';
		console.log(windrose.queryData.endDate);
		queryUpdateWindrose();
	});

});