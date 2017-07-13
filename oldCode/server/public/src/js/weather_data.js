var socket = io.connect('https://94.198.66.59:55555');

var tension = 0;

var isSetup = true;

var clientData = {
	type: "humidity",
	startDate: new Date().toLocaleDateString(),
	endDate: new Date().toLocaleDateString(),
	chart: 1
}

chart_canvas1 = $('#chart1');
var chart1;
var chartOptions1 = {};
var DATA1 = {
	data1: [],
	data2: [],
	data3: [],
	type: ''
};

chart_canvas2 = $('#chart2');
var chart2;
var chartOptions2 = {};
var DATA2 = {
	data1: [],
	data2: [],
	data3: [],
	type: ''
};

$('input[name="daterange1"]').daterangepicker(
{
    locale: {
      format: 'YYYY-MM-DD'
    },
    startDate: clientData.startDate,
    endDate: clientData.endDate
}, 
function(start, end, label) {
	clientData.startDate = start.format('YYYY-MM-DD').toString();
	clientData.endDate = end.format('YYYY-MM-DD').toString();
	clientData.chart = 1;
	socket.emit('clientData', clientData);
});

$('input[name="daterange2"]').daterangepicker(
{
    locale: {
      format: 'YYYY-MM-DD'
    },
    startDate: clientData.startDate,
    endDate: clientData.endDate
}, 
function(start, end, label) {
	clientData.startDate = start.format('YYYY-MM-DD').toString();
	clientData.endDate = end.format('YYYY-MM-DD').toString();
	clientData.chart = 2;
	socket.emit('clientData', clientData);
});

function weatherTypeChanged(chart){
	var x = '';
	if(chart == 1){
    	x = document.getElementById("WeatherType1").value;
    	clientData.chart = 1;
    }
	if(chart == 2){
    	x = document.getElementById("WeatherType2").value;
    	clientData.chart = 2;
    }
	if(x == 'Humidity'){
    	clientData.type = "humidity";
    }
	else if(x == 'Pressure'){
        clientData.type = "pressure";
    }
	else if(x == 'Temperature'){
    	clientData.type = "temperature";
    }
	else if(x == 'Wind'){
    	clientData.type = "wind_direction";   
    }
	else if(x == 'Rainfall'){
    	clientData.type = "rainfall";    
    }
	else{
    	alert("Woops that didn't go so well! :/");
    	return;
    }
	console.log(clientData);
	socket.emit('clientData', clientData);
}

function renderChart(){
	if(clientData.chart == 1){
    	if(chart1 != undefined || chart1 != null){
    		chart1.destroy();
    	}
	chart1 = new Chart(chart_canvas1, chartOptions1);
    }
	else if(clientData.chart == 2){
    	if(chart2 != undefined || chart2 != null){
    		chart2.destroy();
    	}
		chart2 = new Chart(chart_canvas2, chartOptions2);
    }
}

function setChart1(){
	console.log("setChart1");
	if(DATA1.type == "wind_direction"){
    	var types = ["N", "NNO", "NO", "ONO", "O", "OSO", "SO", "SSO", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    	var tmpData = [];
        for(var i = 0; i < DATA1.data1.length; i++){
        	tmpData.push({"x": DATA1.data1[i].x,"y": 15 - types.indexOf(DATA1.data1[i].y),"r": 7});
        }
    	DATA1.data1 = tmpData;
    	chartOptions1 = {
      		type: 'bubble',
      		data: {
            	yLabels: ["N", "NNO", "NO", "ONO", "O", "OSO", "SO", "SSO", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
        		datasets: [
                	{
                    	lineTension: tension,
            			label: 'Wind Direction',
                		yAxisID: "y-axis-0",
            			data: DATA1.data1,
            			borderColor: '#0074d9',
            			borderWidth: 3,
            			pointBorderColor: '#0074d9',
            			pointBorderWidth: 5,
            			backgroundColor: 'rgba(0, 116, 217, 0.2)',
            			pointBackgroundColor: '#000'
          			},
                	{
                    	lineTension: tension,
                		label: 'Wind',
                    	yAxisID: "y-axis-2",
                    	type: 'line',
                    	data: DATA1.data2,
                    	borderColor: '#f4427d',
            			borderWidth: 3,
            			pointBorderColor: '#f4427d',
            			pointBorderWidth: 1,
            			backgroundColor: 'rgba(244, 66, 125, 0.2)',
            			pointBackgroundColor: '#000'
                	},
                	{
                    	lineTension: tension,
                    	label: 'Gust',
                    	yAxisID: "y-axis-2",
                    	type: 'line',
                    	data: DATA1.data3,
                    	borderColor: '#0c6d12',
            			borderWidth: 3,
            			pointBorderColor: '#0c6d12',
            			pointBorderWidth: 1,
            			backgroundColor: 'rgba(12, 109, 18, 0.2)',
            			pointBackgroundColor: '#000'
                    }
                ]
      		},
      		options: {
        		responsive: true,
        		scales: {
          			xAxes: [{
            			type: 'time',
                    	position: 'bottom',
              			time: {
              				displayFormats: {
                				'second': 'HH:mm',
                				'minute': 'HH:mm',
                				'hour': 'HH:mm',
                				'day': 'MMM Do'
                			}
              			},
              			display: true
            		}],
          			yAxes: [
                    	{
                       		"id": "y-axis-1",
                    		type: 'category',
                    		position: 'right',
              				ticks: {
                        		min: "N",
                        		max: "NNW"
              				},
              				display: true
            			},
                    	{	
                        	"id": "y-axis-0",
                    		type: 'linear',
                    		position: 'left',
                        	ticks: {
                        		min: 15,
                        		max: 0
                        	},
                        	display: false
                        },
                    	{
							"id": "y-axis-2",
                        	type: 'linear',
                        	position: 'left',
                        	ticks: {
                            
                            },
                        	display: true
                        }
                    ]
        		}
      		}
    	};
    }
  	else{
    	chartOptions1 = {
      		type: 'line',
      		data: {
        	datasets: [{
            	lineTension: tension,
            	label: document.getElementById("WeatherType1").value,
            	data: DATA1.data1,
            	borderColor: '#0074d9',
            	borderWidth: 2,
            	pointBorderColor: '#0074d9',
            	pointBorderWidth: 1,
            	backgroundColor: 'rgba(0, 116, 217, 0.2)',
            	pointBackgroundColor: '#fff'
          		}]
      		},
      		options: {
        		responsive: true,
        		legend: {
          			display: true,
          			position: 'bottom'
        		},
        		scales: {
          		xAxes: [
            	{
              	type: 'time',
              	time: {
              		displayFormats: {
                		'second': 'HH:mm',
                		'minute': 'HH:mm',
                		'hour': 'HH:mm',
                		'day': 'MMM Do'
                	}
              	},
              		display: true
            	}
          	],
          		yAxes: [
            	{
              		ticks: {
                		
              		},
              		display: true
            		}
          		]
        		}
      		}
    	};
    }
}

function setChart2(){
	console.log("setChart2");
	if(DATA2.type == "wind_direction"){
    	var types = ["N", "NNO", "NO", "ONO", "O", "OSO", "SO", "SSO", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    	var tmpData = [];
        for(var i = 0; i < DATA2.data1.length; i++){
        	tmpData.push({"x": DATA2.data1[i].x,"y": 15 - types.indexOf(DATA2.data1[i].y),"r": 7});
        }
    	DATA2.data1 = tmpData;
    	chartOptions2 = {
      		type: 'bubble',
      		data: {
            	yLabels: ["N", "NNO", "NO", "ONO", "O", "OSO", "SO", "SSO", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
        		datasets: [
                	{
                    	lineTension: tension,
            			label: 'Wind Direction',
                		yAxisID: "y-axis-0",
            			data: DATA2.data1,
            			borderColor: '#0074d9',
            			borderWidth: 3,
            			pointBorderColor: '#0074d9',
            			pointBorderWidth: 5,
            			backgroundColor: 'rgba(0, 116, 217, 0.2)',
            			pointBackgroundColor: '#000'
          			},
                	{
                    	lineTension: tension,
                		label: 'Wind',
                    	yAxisID: "y-axis-2",
                    	type: 'line',
                    	data: DATA2.data2,
                    	borderColor: '#f4427d',
            			borderWidth: 3,
            			pointBorderColor: '#f4427d',
            			pointBorderWidth: 1,
            			backgroundColor: 'rgba(244, 66, 125, 0.2)',
            			pointBackgroundColor: '#000'
                	},
                	{
                    	lineTension: tension,
                    	label: 'Gust',
                    	yAxisID: "y-axis-2",
                    	type: 'line',
                    	data: DATA2.data3,
                    	borderColor: '#0c6d12',
            			borderWidth: 3,
            			pointBorderColor: '#0c6d12',
            			pointBorderWidth: 1,
            			backgroundColor: 'rgba(12, 109, 18, 0.2)',
            			pointBackgroundColor: '#000'
                    }
                ]
      		},
      		options: {
        		responsive: true,
        		scales: {
          			xAxes: [{
            			type: 'time',
                    	position: 'bottom',
              			time: {
              				displayFormats: {
                				'second': 'HH:mm',
                				'minute': 'HH:mm',
                				'hour': 'HH:mm',
                				'day': 'MMM Do'
                			}
              			},
              			display: true
            		}],
          			yAxes: [
                    	{
                       		"id": "y-axis-1",
                    		type: 'category',
                    		position: 'right',
              				ticks: {
                        		min: "N",
                        		max: "NNW"
              				},
              				display: true
            			},
                    	{	
                        	"id": "y-axis-0",
                    		type: 'linear',
                    		position: 'left',
                        	ticks: {
                        		min: 15,
                        		max: 0
                        	},
                        	display: false
                        },
                    	{
							"id": "y-axis-2",
                        	type: 'linear',
                        	position: 'left',
                        	ticks: {
                            
                            },
                        	display: true
                        }
                    ]
        		}
      		}
    	};
    }
  	else{
    	chartOptions2 = {
      		type: 'line',
      		data: {
        	datasets: [{
            	lineTension: tension,
            	label: x = document.getElementById("WeatherType2").value,
            	data: DATA2.data1,
            	borderColor: '#0074d9',
            	borderWidth: 2,
            	pointBorderColor: '#0074d9',
            	pointBorderWidth: 1,
            	backgroundColor: 'rgba(0, 116, 217, 0.2)',
            	pointBackgroundColor: '#fff'
          		}]
      		},
      		options: {
        		responsive: true,
        		legend: {
          			display: true,
          			position: 'bottom'
        		},
        		scales: {
          		xAxes: [
            	{
              	type: 'time',
              	time: {
              		displayFormats: {
                		'second': 'HH:mm',
                		'minute': 'HH:mm',
                		'hour': 'HH:mm',
                		'day': 'MMM Do'
                	}
              	},
              		display: true
            	}
          	],
          		yAxes: [
            	{
              		ticks: {
                		
              		},
              		display: true
            		}
          		]
        		}
      		}
    	};
    }
}

socket.on('serverData', function(data){
    console.log(data);
	
	if(data.data1.length < 1){
    	alert("You chose a daterange that is outside of the scope where data is available. Please choose a new one");
    	return;
    }
  	
	if(data.chart == 1){
    	DATA1.data1 = data.data1;
    	DATA1.data2 = data.data2;
    	DATA1.data3 = data.data3;
    	DATA1.type = data.type;
    	data.data1 = [];
    	data.data2 = [];
    	data.data3 = [];
    	data.type = '';
    	console.log("1");
    	setChart1();
    }
	else if(data.chart == 2){
    	DATA2.data1 = data.data1;
    	DATA2.data2 = data.data2;
    	DATA2.data3 = data.data3;
    	DATA2.type = data.type;
    	data.data1 = [];
    	data.data2 = [];
    	data.data3 = [];
    	data.type = '';
    	console.log("2");
    	setChart2();
    }

	renderChart();

	if(isSetup){
    	clientData.chart = 2;
    	console.log("startDate " + clientData.startDate + " endDate " + clientData.endDate);
    	socket.emit('clientData', clientData);
    	isSetup = false;
    }
});

function setup() {
	console.log("startDate " + clientData.startDate + " endDate " + clientData.endDate);
	socket.emit('clientData', clientData);
}

setup();