/*
 * dateselector
 * https://github.com/nicolaszhao/dateselector
 *
 * Copyright (c) 2014 Nicolas Zhao
 * Licensed under the MIT license.
 */

(function($) {
	
	var uniqueId = 0;
	
	$.fn.dateselector = function(options) {
		var args = Array.prototype.slice.call(arguments, 1);
		
		if (typeof options === 'string') {
			this.each(function() {
				var inst = $(this).data('dateselector');
				
				if (inst && typeof inst[options] === 'function' && options.charAt(0) !== '_') {
					inst[options].apply(inst, args);
				}
			});
		} else {
			options = $.extend({}, $.fn.dateselector.defaults, options);
			this.each(function() {
				var inst = $(this).data('dateselector');
				
				if (inst) {
					inst.option(options);
				} else {
					$(this).data('dateselector', $.fn.dateselector.Dateselector(this, options));
				}
			});
		}
		
		return this;
	}; 
	
	$.fn.dateselector.defaults = {
		monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		
		// format a select date output to the input
		// d - day of month (no leading zero)
		// dd - day of month (two digit)
		// m - month of year (no leading zero)
		// mm - month of year (two digit)
		// y - year (two digit)
		// yy - year (four digit)
		dateFormat: 'mm/dd/yy',
		
		// relative to today's year('-nn:+nn')
		// absolute year('nnnn:nnnn')
		// combinations of these formats('nnnn:-nn')
		yearRange: '1949:-10',
	};
	
	$.fn.dateselector.Dateselector = function(element, options) {
		if (!(this instanceof $.fn.dateselector.Dateselector)) {
			return new $.fn.dateselector.Dateselector(element, options);
		}
		
		this._id = 'dateselector-' + ++uniqueId;
		this._$element = $(element);
		this._$div = $('<div id="' + this._id + '" class="dateselector" />').insertBefore(this._$element);
		this._options = $.extend({}, options);
		this._create();
	};
	
	$.fn.dateselector.Dateselector.prototype = {
		constructor: $.fn.dateselector.Dateselector,
		
		_create: function() {
			var that = this;
			
			this._hideOriginalElement();
			this._$div.on('change.dateselector', 'select', function(event) {
				var $div = $(event.delegateTarget),
					$day = $div.find('.dateselector-day'),
					year = $div.find('.dateselector-year').val(),
					month = $div.find('.dateselector-month').val(),
					day, originalDay, lastDay, date;
				
				if ($(this).is('.dateselector-year, .dateselector-month')) {
					originalDay = $day.find('option:selected').index();
					$day.empty().append(that._generateDayOptions(year, month));
					lastDay = $day.find('option:last').index();
					$day.find('option').eq(originalDay > lastDay ? lastDay : originalDay).prop('selected', true);
				}
				
				day = $day.val();
				that._value(year, month, day);
			});
			
			this._refresh();
		},
		
		_hideOriginalElement: function() {
			if (this._$element.is(':visible')) {
				this._$element.css({
					width: 1,
					height: 1,
					padding: 0,
					margin: '-1px',
					border: 0,
					clip: 'rect(0 0 0 0)',
					overflow: 'hidden',
					position: 'absolute'
				});
			}
		},
		
		_generateHTML: function() {
			var years = this._options.yearRange.split(':'),
				thisYear = new Date().getFullYear(),
				year, endYear, month, html, dayOptionsHtml;
			
			var determineYear = function(value) {
				var year = (value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) : parseInt(value, 10));
				
				return (isNaN(year) ? thisYear : year);
			};
			
			year = determineYear(years[0]);
			endYear = Math.max(year, determineYear(years[1] || ''));
			dayOptionsHtml = this._generateDayOptions(year, 0);
			
			html = '<select class="dateselector-year">';
			for (; year <= endYear; year++) {
				html += '<option value="' + year + '">' + year + '</option>';
			}
			html += '</select>';
			html += '<select class="dateselector-month">';
			for (month = 0; month < 12; month++) {
				html += '<option value="' + month + '">' + this._options.monthNames[month] + '</option>';
			}
			html += '</select>';
			html += '<select class="dateselector-day">' + dayOptionsHtml + '</select>';
			
			return html;
		},
		
		_generateDayOptions: function(year, month) {
			var days = [31, $.fn.dateselector.utils.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
				dayshtml = '',
				day = 1;
			
			for (; day <= days[month]; day++) {
				dayshtml += '<option value="' + day + '">' + (day < 10 ? '0' + day : day) + '</option>';
			}
			
			return dayshtml;
		},
		
		_value: function(year, month, day) {
			var date = new Date(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10));
			
			date = $.fn.dateselector.utils.formatDate(this._options.dateFormat, date);
			this._$element.val(date);
		},
		
		_refresh: function() {
			this._$div.empty().append(this._generateHTML());
			this._value(this._$div.find('.dateselector-year').val(), 
					this._$div.find('.dateselector-month').val(),
					this._$div.find('.dateselector-day').val());
		},
		
		option: function(options) {
			$.extend(this._options, options);
			this._refresh();
		}
	};
	
	$.fn.dateselector.utils = {
		isLeapYear: function(year) {
			return !(year % 4) && ((year % 100 !== 0) || !(year % 400) );
		},
		
		formatDate: function(format, date) {
			if (!date) {
				return '';
			}
			
			var output = '',
				iFormat,
				
				lookAhead = function(match) {
					var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
					
					if (matches) {
						iFormat++;
					}
					
					return matches;
				},
				
				formatNumber = function(match, value, len) {
					var num = '' + value;
					
					if (lookAhead(match)) {
						while (num.length < len) {
							num = '0' + num;
						}
					}
					
					return num;
				};
			
			for (iFormat = 0; iFormat < format.length; iFormat++) {
				switch (format.charAt(iFormat)) {
					case 'd':
						output += formatNumber('d', date.getDate(), 2);
						break;
					case 'm':
						output += formatNumber('m', date.getMonth() + 1, 2);
						break;
					case 'y':
						output += (lookAhead('y') ? date.getFullYear() : 
								(date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
						break;
					default:
						output += format.charAt(iFormat);
				}
			}
			
			return output;
		}
	};

}(jQuery));
