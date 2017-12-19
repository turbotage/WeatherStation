/**
* Thobias Bergqvist
*
* Dependencies
* - jQuery
*/
if (typeof jQuery == 'undefined') {
	throw new Error('jQuery is not loaded');
}

$.fn.calendar = function(options) {
	var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

	var opts = $.extend({}, options);
	if (opts.firstDate) {
		opts.firstDate = new Date(opts.firstDate.getFullYear(), opts.firstDate.getMonth(), opts.firstDate.getDate(), 0, 0, 0, 1);
	}
	if (opts.lastDate) {
		opts.lastDate = new Date(opts.lastDate.getFullYear(), opts.lastDate.getMonth(), opts.lastDate.getDate(), 23, 59, 59, 9999);
	}
	if (opts.selectedDate === undefined) {
		opts.selectedDate = new Date();
	}
	opts.selectedDate.setHours(12);
	opts.selectedDate.setMinutes(0);
	opts.selectedDate.setSeconds(0);
	opts.selectedDate.setMilliseconds(0);
	if (opts.displayDate === undefined) {
		opts.displayDate = opts.selectedDate;
	}
	opts.displayDate.setHours(12);
	opts.displayDate.setMinutes(0);
	opts.displayDate.setSeconds(0);
	opts.displayDate.setMilliseconds(0);
	
	if (opts.callback === undefined) {
		opts.callback = function(year, month, date) {
			// console.log([year, month, date].join('-'));
		}
	}

	function trigger(date){
		opts.callback(date.getFullYear(), date.getMonth()+1, date.getDate());
	}
	
	function increaseMonths(date, months) {
		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDate();

		// create date with correct new year and month
		var incDate = new Date(year, month+months);
		// save new month
		var incMonth = incDate.getMonth();
		// set day
		incDate.setDate(day);
		// decrease 1 day until correct new month 
		while (incDate.getMonth() > incMonth) {
			incDate.setDate(-1);
		}
		return incDate;
	}
	
	function increaseDays(date, days) {
		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDate();
		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		var msec = date.getMilliseconds();
		return new Date(year, month, day+days, hour, min, sec, msec);
	}
	
	function inScope(date) {
		if (opts.firstDate) {
			if (opts.firstDate.getTime() >= date.getTime()) {
				return false;
			}
		}
		if (opts.lastDate) {
			if (opts.lastDate.getTime() <= date.getTime()) {
				return false;
			}
		}
		return true;
	}
	
	function isCurrent(date) {
		return  opts.selectedDate.getFullYear() == date.getFullYear() &&
				opts.selectedDate.getMonth() == date.getMonth() &&
				opts.selectedDate.getDate() == date.getDate();
	}
	
	this.each(function(){
		var me = $(this);
		layout(me);
		trigger(opts.selectedDate); // this will trigger on first render.
	});
	
	function layout(obj) {
		obj.empty();
		obj.append(build(opts.displayDate.getFullYear(), opts.displayDate.getMonth(), opts.displayDate.getDate()));

		$('a.prev-year', obj).click(function(){
			opts.displayDate = increaseMonths(opts.displayDate, -12);
			layout(obj);
		});
		$('a.next-year', obj).click(function(){
			opts.displayDate = increaseMonths(opts.displayDate, 12);
			layout(obj);
			// trigger(opts.displayDate);
		});
		$('a.prev-month', obj).click(function(){
			opts.displayDate = increaseMonths(opts.displayDate, -1);
			layout(obj);
			// trigger(opts.displayDate);
		});
		$('a.next-month', obj).click(function(){
			opts.displayDate = increaseMonths(opts.displayDate, 1);
			layout(obj);
			// trigger(opts.displayDate);
		});
		$('a.cal-action', obj).click(function(){
			opts.selectedDate = $(this).data('date');
			opts.displayDate = opts.selectedDate;
			layout(obj);
			trigger(opts.selectedDate);
		});
	};
	
	function build(year, month, date) {
		var tbl = $('<table class="table calendar"></table>');

		var headRow = $('<tr></tr>');
		
		var prevYear = $('<td><a href="#" class="pad cal-current prev-year"><span class="fa fa-arrow-left"></span></a></td>');
		var textYear = $('<td><span class="pad bold text-year">...</span></td>');
		var nextYear = $('<td><a href="#" class="pad cal-current next-year"><span class="fa fa-arrow-right"></span></a></td>');
		
		var prevMonth = $('<td><a href="#" class="pad cal-current prev-month"><span class="fa fa-arrow-left"></span></a></td>');
		var textMonth = $('<td colspan="2"><span class="pad bold text-month">...</span></td>');
		var nextMonth = $('<td><a href="#" class="pad cal-current next-month"><span class="fa fa-arrow-right"></span></a></td>');
		
		headRow.append(prevMonth);
		headRow.append(textMonth);
		headRow.append(nextMonth);
		headRow.append(prevYear);
		headRow.append(textYear);
		headRow.append(nextYear);
		
		var daysRow = $('<tr></tr>');
		daysRow.append($('<td><span class="pad bold">Mon</span></td>'));
		daysRow.append($('<td><span class="pad bold">Tue</span></td>'));
		daysRow.append($('<td><span class="pad bold">Wen</span></td>'));
		daysRow.append($('<td><span class="pad bold">Thu</span></td>'));
		daysRow.append($('<td><span class="pad bold">Fri</span></td>'));
		daysRow.append($('<td><span class="pad bold">Sat</span></td>'));
		daysRow.append($('<td><span class="pad bold">Sun</span></td>'));
		
		tbl.append(headRow);
		tbl.append(daysRow);
		
		$('.text-year', tbl).html(year);
		$('.text-month', tbl).html(monthNames[month]);

		var iterDate = new Date(year, month, 1, 12, 0, 0, 1); // first in current month
		
		// offset to first day
		var index = iterDate.getDay()-1;
		if (index < 0) {
			index = 6;
		}
		// set to first monday
		iterDate = increaseDays(iterDate, -index);
		for (var w=0; w<6; w++) { // 6 weeks
			var row = $('<tr></tr>');
			for (var i=0; i<7; i++) { // 7 days
				if (inScope(iterDate)){
					if (iterDate.getMonth() === month) {
						var cls = isCurrent(iterDate) ? 'cal-selected' : 'cal-current';
						var cell = $('<td><a href="#" class="pad cal-action ' + cls + '">' + iterDate.getDate() + '</a></td>');
						$('a', cell).data('date', new Date(iterDate.getFullYear(), iterDate.getMonth(), iterDate.getDate(), 12, 0, 0, 1));
						row.append(cell);
					} else {
						var cell = $('<td><a href="#" class="pad cal-action cal-alternate">' + iterDate.getDate() + '</a></td>');
						$('a', cell).data('date', new Date(iterDate.getFullYear(), iterDate.getMonth(), iterDate.getDate(), 12, 0, 0, 1));
						row.append(cell);
					}
				} else {
					var cell = $('<td><span class="pad text-muted">' + iterDate.getDate() + '</span></td>');
					row.append(cell);
				}
				iterDate = increaseDays(iterDate, 1);
			}
			tbl.append(row);
		};

		return tbl;
	}
}