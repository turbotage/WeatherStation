/**
 * Thobias Bergqvist
 *
 * Dependencies
 * - jQuery
 */

/*
 <div class="progress" id="radar-progress">
	 <span class="progress-part" id="prog-load"></span>
	 <span class="progress-part" id="prog-play"></span>
	 <span href="#" class="nav nav-icon progress-part progress-slider" id="prog-slide" data-value="--:--">
	   <i class="fa fa-bars fa-rotate-90"></i>
	 <i class="fa fa-bars fa-rotate-90"></i>
	 </span>
	 <!-- <span class="progress-part progress-right"></span> -->
	 <span class="progress-part progress-label"></span>
 </div>			
 */

(function($){
	'use strict';
	
	var Slider = function(element, options) {
		this.options = options;
		this.element = $(element);
		this.elements = {};

		// create dom objects
		this.element.addClass('sid-slider');
		this.elements.load = $('<span class="sid-slider-load"></span>');
		//this.elements.play = $('<span class="sid-slider-play"></span>');
		this.elements.hand = $('<a href="#" class="sid-slider-hand"></a>');
		this.elements.hand.append('<i class="fa fa-bars fa-rotate-90"></i>');
		this.elements.hand.hide();
		this.elements.text = $('<span class="sid-slider-text"></span>');
		this.element.append(this.elements.load, this.elements.hand, this.elements.text);
		
		this.active = false;

		this.elements.hand.click(function(e){
			e.preventDefault();
			return false;
		});

		$('body').on('mouseup mouseleave', {plugin:this}, function(e){
			e.data.plugin.active = false;
		});
		$('body').on('mousemove', {plugin:this}, function(e){
			if (e.which === 1 && e.data.plugin.active === true) {
				e.preventDefault();
				e.data.plugin._move(e.pageX);
				return false;
			}
		});
		this.element.on('mousedown', {plugin:this}, function(e){
			if (e.which === 1) {
				e.preventDefault();
				e.data.plugin.active = true;
				e.data.plugin._move(e.pageX);
				e.data.plugin.elements.hand.focus();
				return false;
			}
		});

		this.element.on('touchstart', {plugin: this}, function(e){
			e.preventDefault();
			var touches = e.originalEvent.changedTouches;
			for (var i=0; i<touches.length; i++) {
				e.data.plugin._move(touches[i].pageX);
			}
			e.data.plugin.elements.hand.focus();
			return false;
		});
		this.element.on('touchmove', {plugin: this}, function(e){
			e.preventDefault();
			var touches = e.originalEvent.changedTouches;
			for (var i=0; i<touches.length; i++) {
				e.data.plugin._move(touches[i].pageX);
			}
			return false;
		});
	};
	
	Slider.DEFAULTS = {
		labelForSelected: function(index) {
			return index;
		}
	};

	Slider.prototype._move = function(pageX) {
		var elementX = this.element.offset().left;
		var elementWidth = this.element.innerWidth();
		var ratio = ((pageX-elementX)/elementWidth);
		var index = Math.floor(ratio*this.options.count);
		index = Math.min(Math.max(index,0), Math.max(this.options.count-1,0));
		if (index !== this.options.selected) {
			this.move(index);
		}
	};
	
	Slider.prototype.clear = function(count) {
		// console.log('clear ' + count);

		this.options.count = count;
		this.options.loaded = 0;
		this.options.selected = 0;
		this.elements.load.css('width', '0%');
		//this.elements.play.css('width', '0%');
		this.elements.hand.hide();
		this.elements.text.html('0%');

		this.element.trigger('cleared.sid.slider', this.options.count);

	};
	
	Slider.prototype.load = function(index) {
		// console.log('load ' + index);
		
		this.options.loaded = index || 0;
		if (this.options.loaded === 0) {
			this.elements.hand.show();
		}
		
		var ratio = ((this.options.loaded)/(this.options.count-1))*100;
		this.elements.load.css('width', ratio + '%');
		this.elements.text.html(Math.ceil(ratio) + '%');
		this.element.trigger('loaded.sid.slider', this.options.loaded);
	};

	Slider.prototype.move = function(index) {
		// console.log('move ' + index);

		this.options.selected = index || 0;

		var ratio = (this.options.selected)/(this.options.count-1)*100;
		//this.elements.play.css('width', ratio + '%');
		this.elements.hand.css('left', ratio + '%');
		this.elements.hand.attr('data-sid-slider', this.options.labelForSelected(this.options.selected));

		this.element.trigger('moved.sid.slider', this.options.selected);
	};
	
	Slider.prototype.select = function(index) {
		// console.log('select ' + index);

		this.options.selected = index || 0;
		
		var ratio = (this.options.selected)/(this.options.count-1)*100;
		//this.elements.play.css('width', ratio + '%');
		this.elements.hand.css('left', ratio + '%');
		this.elements.hand.attr('data-sid-slider', this.options.labelForSelected(this.options.selected));
		
		this.element.trigger('selected.sid.slider', this.options.selected);
	};

	Slider.prototype.step = function(offset) {
		// console.log('step ' + offset);
		
		var index = this.options.selected += offset;
		if (index < 0) {
			index += this.options.count;
			index = Math.max(index, 0);
		} else if (index >= this.options.count) {
			index -= this.options.count;
			index = Math.min(index, this.options.count);
		}
		this.select(index);
	};
	
	/**
	 * Plugin definition
	 * @param first <object> arguments for constructor, or <string> command 
	 * @param second <any> arguments for a <string> command
	 * @returns {*}
	 * @constructor
	 */
	function Plugin(first, second) {
		return this.each(function(){
			var element = $(this);
			var plugin = element.data('sid.slider');
			if (!plugin) {
				var options = $.extend({}, Slider.DEFAULTS, first);
				plugin = new Slider(this, options);
				element.data('sid.slider', plugin);
			}
			if (typeof first === 'string') {
				plugin[first](second);
			}
		});
	}
	
	$.fn.slider = Plugin;
	$.fn.slider.Constructor = Slider;

})(jQuery);
