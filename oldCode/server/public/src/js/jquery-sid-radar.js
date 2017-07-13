/**
 * Thobias Bergqvist
 *
 * Dependencies
 * - jQuery
 */

(function ($) {
	'use strict';

	var Radar = function (element, options) {
		this.options = options;
		this.element = $(element);
		this.elements = {
			layers: []
		};
		this.state = {
			images: [],
			loopId: undefined
		};

		// create dom objects
		this.element.addClass('sid-radar');

		for (var i = 0; i < this.options.layers.length; i++) {
			this.elements.layers.push($('<img src="' + this.options.layers[i] + '" class="sid-radar-layer" style="z-index: ' + (i + 1) + '"/>'));
		}
		this.elements.canvas = $('<canvas class="sid-radar-layer" style="z-index: ' + (++i) + '"></canvas>');
		this.elements.layers.push(this.elements.canvas);
		this.context = this.elements.canvas.get(0).getContext('2d');

		this.elements.legendDate = $('<div class="sid-radar-legend sid-radar-legend-date" style="z-index: ' + (++i) + '"></div>');
		this.elements.legendTime = $('<div class="sid-radar-legend sid-radar-legend-time" style="z-index: ' + (++i) + '"></div>');
		this.elements.legendMark = $('<div class="sid-radar-legend sid-radar-legend-mark"></div>');
		//this.elements.legendMark.hide();
		var height = 100 / Radar.LEGEND.length;
		for (var i = Radar.LEGEND.length - 1; i >= 0; i--) {
			var item = $('<a class="sid-radar-legend-mark-item" style="background-color: ' + Radar.LEGEND[i].color + '; height: ' + height + '%"></a>');
			item.data('radar-legend', Radar.LEGEND[i]);
			if (Radar.LEGEND[i].legend) {
				item.attr('data-radar-legend-dbz', Radar.LEGEND[i].legend);
				if (Radar.LEGEND[i].dbz>0) {
					item.addClass('sid-radar-legend-mark-border');
				}
			}
			this.elements.legendMark.append(item);
		}

		// create control
		this.elements.control = $('<div class="bar sid-radar-bar">');
		var table = $('<table class="nav">');
		var tr = $('<tr>');

		var tdWest = $('<td class="nav-west nav-medium">');
		this.elements.cmdLoop = $('<a id="radar-cmd-loop" class="nav nav-icon" href="#"><i class="fa fa-play"></i></a>');
		this.elements.cmdPrev = $('<a id="radar-cmd-prev" class="nav nav-icon" href="#"><i class="fa fa-step-backward"></i></a>');

		var tdFull = $('<td class="nav-main nav-full">');
		this.elements.cmdSlider = $('<div id="radar-slider"></div>');

		var tdEast = $('<td class="nav-east nav-medium">');
		this.elements.cmdNext = $('<a id="radar-cmd-next" class="nav nav-icon" href="#"><i class="fa fa-step-forward"></i></a>');
		this.elements.cmdMore = $('<a id="radar-cmd-more" class="nav nav-icon" href="#"><i class="fa fa-th-list"></i></a>');

		this.elements.control.append(table);
		table.append(tr);
		tr.append(tdWest);
		tdWest.append(this.elements.cmdLoop);
		tdWest.append(this.elements.cmdPrev);
		tr.append(tdFull);
		tdFull.append(this.elements.cmdSlider);
		tr.append(tdEast);
		tdEast.append(this.elements.cmdNext);
		tdEast.append(this.elements.cmdMore);

		// add to dom
		this.element.append(this.elements.layers, this.elements.legendDate, this.elements.legendTime, this.elements.legendMark, this.elements.control);

		// create slider
		var plugin = this;
		this.elements.cmdSlider.slider({
			labelForSelected: function (index) {
				if (plugin.state.images[index]) {
					return plugin.state.images[index].time;
				} else {
					return index;
				}
			}
		});

		// handle slider
		this.elements.cmdSlider.on('cleared.sid.slider', {plugin: this}, function (e, arg) {
			e.data.plugin._enable(false);
			e.data.plugin._loop(false);
		});
		this.elements.cmdSlider.on('moved.sid.slider', {plugin: this}, function (e, arg) {
			e.data.plugin._loop(false);
			e.data.plugin._draw(arg);
		});
		this.elements.cmdSlider.on('selected.sid.slider', {plugin: this}, function (e, arg) {
			e.data.plugin._enable(true);
			e.data.plugin._draw(arg);
		});
		this.elements.cmdSlider.on('loaded.sid.slider', {plugin:this}, function(e,arg){
			e.data.plugin.element.trigger('loaded.sid.radar', arg);
		});

		// handle buttons
		this.elements.cmdPrev.on('click', {plugin: this}, function (e) {
			e.preventDefault();
			e.data.plugin._loop(false);
			e.data.plugin.elements.cmdSlider.slider('step', -1);
			return false;
		});

		this.elements.cmdNext.on('click', {plugin: this}, function (e) {
			e.preventDefault();
			e.data.plugin._loop(false);
			e.data.plugin.elements.cmdSlider.slider('step', 1);
			return false;
		});

		this.elements.cmdLoop.on('click', {plugin: this}, function (e) {
			e.preventDefault();
			e.data.plugin._loop(e.data.plugin.state.loopId === undefined);
			return false;
		});

		this.elements.cmdMore.on('click', {plugin: this}, function (e) {
			e.preventDefault();
			e.data.plugin.elements.legendMark.toggle();
			return false;
		});

		// handle resize
		$(window).on('resize', {plugin: this}, function (e) {
			e.data.plugin._resize();
		});

		// init controls
		this.elements.cmdSlider.slider('clear', this.state.images.length);
		//this._enable(false);

		// trigger first resize
		this._resize();
	};

	Radar.DEFAULTS = {
		imageWidth: 471,
		imageHeight: 887,
		loopInterval: 200,
		loopStep: 1,
		layers: []
	};

	Radar.prototype.load = function (args) {
		if (args) {
			this.state.images = args;
		}
		this._draw(-1);
		this.elements.cmdSlider.slider('clear', this.state.images.length);
		var loaded = 0;
		var plugin = this;
		for (var i = 0; i < this.state.images.length; i++) {
			this.state.images[i].img = new Image();
			if (i===0) {
				this.state.images[i].img.onload = function () {
					plugin.elements.cmdSlider.slider('load', loaded);
					plugin.elements.cmdSlider.slider('select', 0);
					loaded++;
				};
			} else {
				this.state.images[i].img.onload = function () {
					plugin.elements.cmdSlider.slider('load', loaded);
					loaded++;
				};
			}
			this.state.images[i].img.src = this.state.images[i].url;
		}
	};

	Radar.prototype._loop = function (loop) {
		if (loop && this.state.loopId === undefined) {
			$('i', this.elements.cmdLoop).removeClass('fa-play').addClass('fa-pause');
			var plugin = this;
			this.state.loopId = window.setInterval(function () {
				plugin.elements.cmdSlider.slider('step', plugin.options.loopStep);
			}, this.options.loopInterval);
		} else if (!loop && this.state.loopId) {
			$('i', this.elements.cmdLoop).removeClass('fa-pause').addClass('fa-play');
			window.clearInterval(this.state.loopId);
			this.state.loopId = undefined;
		}
	};

	Radar.prototype._enable = function (enabled) {
		this.elements.cmdLoop.enabled(enabled);
		this.elements.cmdPrev.enabled(enabled);
		this.elements.cmdSlider.enabled(enabled);
		this.elements.cmdNext.enabled(enabled);
	};

	Radar.prototype._resize = function () {

		var width = this.element.width();
		var height = this.element.height() - 40;

		var rx = width / this.options.imageWidth;
		var ry = height / this.options.imageHeight;

		var r = Math.min(rx, ry);

		var rw = Math.floor(this.options.imageWidth * r);
		var rh = Math.floor(this.options.imageHeight * r);

		var dx = (width - rw) / 2;
		var dy = (height - rh) / 2;

		for (var i = 0; i < this.elements.layers.length; i++) {
			var layer = this.elements.layers[i];
			layer.attr('width', rw);
			layer.attr('height', rh);
			layer.css('top', dy);
			layer.css('left', dx);
		}
		this._draw();
	};

	Radar.prototype._draw = function (index) {
		this.context.clearRect(0, 0, this.elements.canvas.width(), this.elements.canvas.height());
		if (index === undefined) {
			index = this.state.index;
		}

		if (index !== undefined && this.state.images[index] && this.state.images[index].img) {
			this.context.drawImage(this.state.images[index].img, 0, 0, this.elements.canvas.width(), this.elements.canvas.height());
			this.elements.legendDate.html(this.state.images[index].date).show();
			this.elements.legendTime.html(this.state.images[index].time).show();
			this.state.index = index;
			this.elements.legendDate.show();
			this.elements.legendTime.show();
		} else {
			this.elements.legendDate.hide();
			this.elements.legendTime.hide();
		}
	};

	// mmh is calculated with this Math.pow(Math.pow(10, (dbz / 10)) / 200, 2 / 3)
	Radar.LEGEND =[
		{color:"rgba(54,54,54,1)", lo:"-29", hi:"-28", dbz:-29, mmh:0.00034091543902876615},
		{color:"rgba(55,55,55,1)", lo:"-28", hi:"-27", dbz:-28, mmh:0.0003974782199481834},
		{color:"rgba(56,56,56,1)", lo:"-27", hi:"-26", dbz:-27, mmh:0.0004634255807929115},
		{color:"rgba(57,57,57,1)", lo:"-26", hi:"-25", dbz:-26, mmh:0.0005403145585215831},
		{color:"rgba(58,58,58,1)", lo:"-25", hi:"-24", dbz:-25, mmh:0.0006299605249474369},
		{color:"rgba(59,59,59,1)", lo:"-24", hi:"-23", dbz:-24, mmh:0.0007344800482110234},
		{color:"rgba(60,60,60,1)", lo:"-23", hi:"-22", dbz:-23, mmh:0.0008563408655884893},
		{color:"rgba(61,61,61,1)", lo:"-22", hi:"-21", dbz:-22, mmh:0.0009984201475084218},
		{color:"rgba(62,62,62,1)", lo:"-21", hi:"-20", dbz:-21, mmh:0.001164072428408161},
		{color:"rgba(63,63,63,1)", lo:"-20", hi:"-19", dbz:-20, mmh:0.0013572088082974539},
		{color:"rgba(64,64,64,1)", lo:"-19", hi:"-18", dbz:-19, mmh:0.001582389295002119},
		{color:"rgba(65,65,65,1)", lo:"-18", hi:"-17", dbz:-18, mmh:0.0018449304673157714},
		{color:"rgba(66,66,66,1)", lo:"-17", hi:"-16", dbz:-17, mmh:0.002151031001018895},
		{color:"rgba(67,67,67,1)", lo:"-16", hi:"-15", dbz:-16, mmh:0.0025079180214721986},
		{color:"rgba(68,68,68,1)", lo:"-15", hi:"-14", dbz:-15, mmh:0.0029240177382128672},
		{color:"rgba(69,69,69,1)", lo:"-14", hi:"-13", dbz:-14, mmh:0.0034091543902876613},
		{color:"rgba(70,70,70,1)", lo:"-13", hi:"-12", dbz:-13, mmh:0.003974782199481832},
		{color:"rgba(71,71,71,1)", lo:"-12", hi:"-11", dbz:-12, mmh:0.004634255807929115},
		{color:"rgba(72,72,72,1)", lo:"-11", hi:"-10", dbz:-11, mmh:0.005403145585215831},
		{color:"rgba(73,73,73,1)", lo:"-10", hi:"-9", dbz:-10, mmh:0.006299605249474368, legend:'mm/h'},
		{color:"rgba(74,74,74,1)", lo:"-9", hi:"-8", dbz:-9, mmh:0.007344800482110232},
		{color:"rgba(75,75,75,1)", lo:"-8", hi:"-7", dbz:-8, mmh:0.00856340865588489},
		{color:"rgba(76,76,76,1)", lo:"-7", hi:"-6", dbz:-7, mmh:0.00998420147508422},
		{color:"rgba(87,87,87,1)", lo:"-6", hi:"-5", dbz:-6, mmh:0.01164072428408161},
		{color:"rgba(97,97,97,1)", lo:"-5", hi:"-4", dbz:-5, mmh:0.013572088082974536},
		{color:"rgba(108,108,108,1)", lo:"-4", hi:"-3", dbz:-4, mmh:0.015823892950021186},
		{color:"rgba(118,118,118,1)", lo:"-3", hi:"-2", dbz:-3, mmh:0.01844930467315771},
		{color:"rgba(129,129,129,1)", lo:"-2", hi:"-1", dbz:-2, mmh:0.021510310010188948},
		{color:"rgba(139,139,139,1)", lo:"-1", hi:"0", dbz:-1, mmh:0.025079180214721986},
		{color:"rgba(150,150,150,1)", lo:"0", hi:"1", dbz:0, mmh:0.029240177382128668},
		{color:"rgba(160,160,160,1)", lo:"1", hi:"2", dbz:1, mmh:0.03409154390287661},
		{color:"rgba(171,171,171,1)", lo:"2", hi:"3", dbz:2, mmh:0.03974782199481832},
		{color:"rgba(181,181,181,1)", lo:"3", hi:"4", dbz:3, mmh:0.04634255807929114},
		{color:"rgba(192,192,192,1)", lo:"4", hi:"5", dbz:4, mmh:0.05403145585215831},
		{color:"rgba(0,50,255,1)", lo:"5", hi:"6", dbz:5, mmh:0.06299605249474367},
		{color:"rgba(0,70,255,1)", lo:"6", hi:"7", dbz:6, mmh:0.07344800482110231},
		{color:"rgba(0,90,255,1)", lo:"7", hi:"8", dbz:7, mmh:0.08563408655884888},
		{color:"rgba(0,110,255,1)", lo:"8", hi:"9", dbz:8, mmh:0.09984201475084219, legend:0.1}, // ----
		{color:"rgba(0,130,255,1)", lo:"9", hi:"10", dbz:9, mmh:0.11640724284081609},
		{color:"rgba(0,150,255,1)", lo:"10", hi:"11", dbz:10, mmh:0.13572088082974534},
		{color:"rgba(0,170,255,1)", lo:"11", hi:"12", dbz:11, mmh:0.15823892950021187},
		{color:"rgba(0,128,0,1)", lo:"12", hi:"13", dbz:12, mmh:0.18449304673157707},
		{color:"rgba(0,138,0,1)", lo:"13", hi:"14", dbz:13, mmh:0.21510310010188943},
		{color:"rgba(0,148,0,1)", lo:"14", hi:"15", dbz:14, mmh:0.2507918021472198},
		{color:"rgba(0,158,0,1)", lo:"15", hi:"16", dbz:15, mmh:0.2924017738212866, legend: 0.3}, // ----
		{color:"rgba(0,163,0,1)", lo:"16", hi:"17", dbz:16, mmh:0.34091543902876603},
		{color:"rgba(0,168,0,1)", lo:"17", hi:"18", dbz:17, mmh:0.3974782199481831},
		{color:"rgba(0,173,0,1)", lo:"18", hi:"19", dbz:18, mmh:0.4634255807929114},
		{color:"rgba(0,178,0,1)", lo:"19", hi:"20", dbz:19, mmh:0.5403145585215829},
		{color:"rgba(10,208,10,1)", lo:"20", hi:"21", dbz:20, mmh:0.6299605249474366},
		{color:"rgba(10,218,10,1)", lo:"21", hi:"22", dbz:21, mmh:0.7344800482110231},
		{color:"rgba(10,228,10,1)", lo:"22", hi:"23", dbz:22, mmh:0.8563408655884891},
		{color:"rgba(10,238,10,1)", lo:"23", hi:"24", dbz:23, mmh:0.9984201475084215, legend: 1}, // ----
		{color:"rgba(10,248,10,1)", lo:"24", hi:"25", dbz:24, mmh:1.1640724284081605},
		{color:"rgba(255,255,15,1)", lo:"25", hi:"26", dbz:25, mmh:1.3572088082974534},
		{color:"rgba(255,246,15,1)", lo:"26", hi:"27", dbz:26, mmh:1.5823892950021183},
		{color:"rgba(255,238,15,1)", lo:"27", hi:"28", dbz:27, mmh:1.8449304673157711},
		{color:"rgba(255,229,15,1)", lo:"28", hi:"29", dbz:28, mmh:2.1510310010188936},
		{color:"rgba(255,220,15,1)", lo:"29", hi:"30", dbz:29, mmh:2.5079180214721974},
		{color:"rgba(255,200,0,1)", lo:"30", hi:"31", dbz:30, mmh:2.924017738212866, legend: 3}, // ----
		{color:"rgba(255,180,0,1)", lo:"31", hi:"32", dbz:31, mmh:3.40915439028766},
		{color:"rgba(255,160,0,1)", lo:"32", hi:"33", dbz:32, mmh:3.9747821994818318},
		{color:"rgba(255,140,0,1)", lo:"33", hi:"34", dbz:33, mmh:4.6342558079291125},
		{color:"rgba(255,120,0,1)", lo:"34", hi:"35", dbz:34, mmh:5.403145585215829},
		{color:"rgba(255,35,35,1)", lo:"35", hi:"36", dbz:35, mmh:6.299605249474365},
		{color:"rgba(255,15,15,1)", lo:"36", hi:"37", dbz:36, mmh:7.34480048211023},
		{color:"rgba(255,0,0,1)", lo:"37", hi:"38", dbz:37, mmh:8.56340865588489},
		{color:"rgba(235,0,0,1)", lo:"38", hi:"39", dbz:38, mmh:9.984201475084213, legend: 10}, // ----
		{color:"rgba(215,0,0,1)", lo:"39", hi:"40", dbz:39, mmh:11.640724284081605},
		{color:"rgba(195,0,0,1)", lo:"40", hi:"41", dbz:40, mmh:13.572088082974531},
		{color:"rgba(175,0,0,1)", lo:"41", hi:"42", dbz:41, mmh:15.823892950021172},
		{color:"rgba(155,0,0,1)", lo:"42", hi:"43", dbz:42, mmh:18.449304673157712},
		{color:"rgba(135,0,0,1)", lo:"43", hi:"44", dbz:43, mmh:21.51031001018893},
		{color:"rgba(115,0,0,1)", lo:"44", hi:"45", dbz:44, mmh:25.07918021472199},
		{color:"rgba(175,0,175,1)", lo:"45", hi:"46", dbz:45, mmh:29.240177382128653, legend: 30}, // ---
		{color:"rgba(184,0,184,1)", lo:"46", hi:"47", dbz:46, mmh:34.09154390287657},
		{color:"rgba(193,0,193,1)", lo:"47", hi:"48", dbz:47, mmh:39.74782199481832},
		{color:"rgba(202,0,202,1)", lo:"48", hi:"49", dbz:48, mmh:46.342558079291116},
		{color:"rgba(211,0,211,1)", lo:"49", hi:"50", dbz:49, mmh:54.03145585215832},
		{color:"rgba(219,0,219,1)", lo:"50", hi:"51", dbz:50, mmh:62.996052494743644},
		{color:"rgba(228,0,228,1)", lo:"51", hi:"52", dbz:51, mmh:73.44800482110224},
		{color:"rgba(237,0,237,1)", lo:"52", hi:"53", dbz:52, mmh:85.63408655884888},
		{color:"rgba(246,0,246,1)", lo:"53", hi:"54", dbz:53, mmh:99.84201475084213, legend: 100}, // ---
		{color:"rgba(255,0,255,1)", lo:"54", hi:"55", dbz:54, mmh:116.40724284081611},
		{color:"rgba(0,255,255,1)", lo:"55", hi:"56", dbz:55, mmh:135.72088082974528},
		{color:"rgba(13,255,255,1)", lo:"56", hi:"57", dbz:56, mmh:158.2389295002117},
		{color:"rgba(26,255,255,1)", lo:"57", hi:"58", dbz:57, mmh:184.4930467315771},
		{color:"rgba(39,255,255,1)", lo:"58", hi:"59", dbz:58, mmh:215.10310010188928},
		{color:"rgba(51,255,255,1)", lo:"59", hi:"60", dbz:59, mmh:250.79180214721987},
		{color:"rgba(64,255,255,1)", lo:"60", hi:"61", dbz:60, mmh:292.4017738212865, legend: 300}, // ---
		{color:"rgba(77,255,255,1)", lo:"61", hi:"62", dbz:61, mmh:340.91543902876566},
		{color:"rgba(90,255,255,1)", lo:"62", hi:"63", dbz:62, mmh:397.4782199481831},
		{color:"rgba(102,255,255,1)", lo:"63", hi:"64", dbz:63, mmh:463.4255807929111},
		{color:"rgba(115,255,255,1)", lo:"64", hi:"65", dbz:64, mmh:540.3145585215831},
		{color:"rgba(128,255,255,1)", lo:"65", hi:"66", dbz:65, mmh:629.9605249474364},
		{color:"rgba(141,255,255,1)", lo:"66", hi:"67", dbz:66, mmh:734.4800482110223},
		{color:"rgba(154,255,255,1)", lo:"67", hi:"68", dbz:67, mmh:856.3408655884888},
		{color:"rgba(166,255,255,1)", lo:"68", hi:"69", dbz:68, mmh:998.4201475084211, legend: 1000},
		{color:"rgba(179,255,255,1)", lo:"69", hi:"70", dbz:69, mmh:1164.072428408161},
		{color:"rgba(192,255,255,1)", lo:"70", hi:"220", dbz:70, mmh:1357.2088082974528}];

	/**
	 * Plugin definition
	 * @param first <object> arguments for constructor, or <string> command
	 * @param second <any> arguments for a <string> command
	 * @returns {*}
	 * @constructor
	 */
	function Plugin(first, second) {
		return this.each(function () {
			var element = $(this);
			var plugin = element.data('sid.radar');
			if (!plugin) {
				var options = $.extend({}, Radar.DEFAULTS, first);
				plugin = new Radar(this, options);
				element.data('sid.radar', plugin);
			}
			if (typeof first === 'string') {
				plugin[first](second);
			}
		});
	}

	$.fn.radar = Plugin;
	$.fn.radar.Constructor = Radar;

	$.fn.enabled = function (enable) {
		return this.each(function () {
			if (enable) {
				$(this).removeClass('disabled');
			} else {
				$(this).addClass('disabled');
			}
		});
	};

})(jQuery);
