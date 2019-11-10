var db = require('../setup_modules/db');

// N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW

function getDirectionName(degree) {
    var dirList = ["N","NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    if ( (degree > 348.75) || ( (degree >= 0) && (degree < 12.25) ) ) {
        return "N"; // same as disList[0];
    }
    for (var i = 1; i < 16; i++) {
        if ( ((22.5*i - 12.25) <= degree) && (degree < (22.5*i + 12.25)) ) {
            return dirList[i];
        }
    }
}

function getDirectionNumber(degree) {
    var dirList = ["N","NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    if ( (degree > 348.75) || ( (degree >= 0) && (degree < 12.25) ) ) {
        return 0; // same as disList[0];
    }
    for (var i = 1; i < 16; i++) {
        if ( ((22.5*i - 12.25) <= degree) && (degree < (22.5*i + 12.25)) ) {
            return i;
        }
    }
}

function onWindroseQuerys(socket) {

    socket.on('wind-query-windrose', function(data){
        var datetimeDependence = " AND datetime BETWEEN \'" + data.startDate + "\' AND \'" + data.endDate + "\'";

        var clientData = [];

        var vindSpeedList = [[0, 0.5], [0.5,2],[2,6],[6,10],[10,14],[14,18],[18,22],[22,26]];
        var queryCmd = "";

        var totalRows = 0;

        var freqArray = new Array(vindSpeedList.length + 1);
        for (var i = 0; i < freqArray.length; i++){
            freqArray[i] = new Array(16); //every speed range has 16 directions
        }
        // Loop to initilize 2D array elements. 
        for (var i = 0; i < vindSpeedList.length + 1; i++) { 
            for (var j = 0; j < 16; j++) { 
                freqArray[i][j] = 0;
            } 
        } 

        recursiveQuery(0);
        //pass zero
        function recursiveQuery(num) {
            
            if (num != vindSpeedList.length) {
                //do for i'th range
                queryCmd = "SELECT direction FROM wind WHERE (wind >= " + vindSpeedList[num][0].toString() 
                + ") AND (wind < " + vindSpeedList[num][1].toString() + ")" + datetimeDependence;

                //console.log(queryCmd);
                db.query(queryCmd, function(err, rows, result) {
                    if (err) throw err;
                    totalRows += rows.length;
                    for (var i = 0; i < rows.length; i++) {
                        freqArray[num][getDirectionNumber(rows[i].direction)]++;
                    }
                    //increase num
                    num++;
                    recursiveQuery(num);
                    return;
                });
            }
            else {
                //last do a query for windspeeds above the highest pair in windSpeedList
                queryCmd = "SELECT wind,direction FROM wind WHERE (wind >= " 
                + vindSpeedList[vindSpeedList.length - 1][1].toString() + ")" + datetimeDependence;

                //console.log(queryCmd);
                db.query(queryCmd, function(err, rows, result) {
                    if (err) throw err;
                    totalRows += rows.length;
                    for (var i = 0; i < rows.length; i++) {
                        freqArray[num][getDirectionNumber(rows[i].direction)]++;
                    }

                    for (var i = 0; i < vindSpeedList.length; i++) {
                        var dataToAdd = [];
                        for (var j = 0; j < 16; j++) { 
                            dataToAdd.push([j, 100*freqArray[i][j]/totalRows]);
                        }
                        clientData.push({ 
                            name: vindSpeedList[i][0].toString() + "-" + vindSpeedList[i][1].toString() + " m/s",
                            data: dataToAdd,
                            _colorIndex: i
                        });
                    }

                    var dataToAdd = [];
                    for (var j = 0; j < 16; j++) { 
                        dataToAdd.push([j, 100*freqArray[vindSpeedList.length][j]/totalRows]);
                    }
                    clientData.push({ 
                        name: "> " + vindSpeedList[vindSpeedList.length - 1][1].toString() + " m/s",
                        data: dataToAdd,
                        _colorIndex: vindSpeedList.length
                    });

					clientData.reverse();
                    //finaly emit
                    socket.emit('wind-resp-windrose', clientData);
                });
            }
        }

    });

}

module.exports.onWindroseQuerys = onWindroseQuerys;

