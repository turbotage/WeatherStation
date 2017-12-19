$(document).ready(function(){

	// START REPLACE (env replaced by spec)
	var apiBaseUrl = 'https://opendata-download-radar.smhi.se';
	// END REPLACE

	$('#radar-view').radar({
		layers: [
			'../../src/img/basemap.png',
			'../../src/img/outlines.png',
			'../../src/img/cities.png'
		]
	});

	// just put a calendar out there
	$('#radar-control-calendar').calendar({
		selectedDate: new Date(),
		firstDate: new Date('3000-01-01'),
		lastDate: new Date('1000-01-01')
	});
	$('#radar-control-calendar a').enabled(false);
	$('.dl').enabled(false);

	$('#radar-cmd-more').click(function(e){
		e.preventDefault();
		$('#radar-more').toggleClass('hide-mobile');
		return false;
	});

	var url = apiBaseUrl + '/api/version/latest/area/sweden/product/comp?timeZone=Europe/Stockholm';
	var jqxhr = $.getJSON(url);
	jqxhr.fail(function() {
		$('#radar-control-calendar a').enabled(true);
		//alert('Det verkar vara något problem med servern...');
	});
	jqxhr.done(function (data){
		var firstDate = undefined;
		for (var i=0; i<data.firstFiles.length; i++) {
			var firstFile = data.firstFiles[i];
			for (var j=0; j<firstFile.formats.length; j++){
				var format = firstFile.formats[j];
				if (format.key === 'png') {
					firstDate = new Date(firstFile.valid.substr(0,10));
				}
			}
		}
		firstDate || (firstDate = new Date());
		var lastDate = undefined;
		for (var i=0; i<data.lastFiles.length; i++) {
			var lastFile = data.lastFiles[i];
			for (var j=0; j<lastFile.formats.length; j++){
				var format = lastFile.formats[j];
				if (format.key === 'png') {
					lastDate = new Date(lastFile.valid.substr(0,10));
				}
			}
		}
		lastDate || (lastDate = new Date());
		var selectedDate = lastDate;

		$('#radar-control-calendar').calendar({
			firstDate: firstDate,
			lastDate: lastDate,
			selectedDate: lastDate,
			callback: onCalendar
		});
	});

	function onCalendar(year, month, day){
		$('#radar-control-calendar a').enabled(false);
		$('.dl').enabled(false);
		$('#radar-more').addClass('hide-mobile');
		$('#radar-view').off('loaded.sid.radar');
		var url = apiBaseUrl + '/api/version/latest/area/sweden/product/comp/' + year + '/' + month + '/' + day + '?timeZone=Europe/Stockholm';
		var jqxhr = $.getJSON(url);
		jqxhr.fail(function() {
			$('#radar-control-calendar a').enabled(true);
			$('#radar-view').radar('load', []);
			//alert('Det verkar inte finnas bilder för vald dag...');
		});
		jqxhr.done(function(data){
			for (var i=0; i< data.downloads.length; i++) {
				if (data.downloads[i].key === 'png') {
					$('#dl-png').attr('href', data.downloads[i].link).enabled(true);
				} else if (data.downloads[i].key === 'tif') {
					$('#dl-tif').attr('href', data.downloads[i].link).enabled(true);
				}
			}
			var images = [];
			for (var i=0; i<data.files.length; i++) {
				var file = data.files[i];
				var date = file.valid.substr(0, 10);
				var time = file.valid.substr(11, 5);
				var pngs = file.formats.filter(function(item){
					return item.key === 'png'
				});
				if (pngs.length === 1) {
					images.push({
						date: date,
						time: time,
						url: pngs[0].link
					});
				}
			}
			$('#radar-view').on('loaded.sid.radar', function(e,arg){
				if (images.length === arg+1) {
					$('#radar-control-calendar a').enabled(true);
				}
			});
			$('#radar-view').radar('load', images);
		});
	}

});
