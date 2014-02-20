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
		var args = Array.prototype.slice.call(arguments, 1),
			inst;
		
		if (typeof options === 'string' && options === 'value' && arguments.length === 1) {
			inst = this.data('dateselector');
			if (inst) {
				return inst[options].call(inst); 
			}
			return inst;
		}
		
		if (typeof options === 'string') {
			this.each(function() {
				inst = $(this).data('dateselector');
				if (inst && typeof inst[options] === 'function' && options.charAt(0) !== '_') {
					inst[options].apply(inst, args);
				}
			});
		} else {
			options = $.extend({}, $.fn.dateselector.defaults, options);
			this.each(function() {
				inst = $(this).data('dateselector');
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
		
		this._id = 'dateselector-' + (++uniqueId);
		this._$element = $(element);
		this._$div = $('<div id="' + this._id + '" class="dateselector" />').insertBefore(this._$element).css('display', 'inline-block');
		this._options = options;
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
					month = $div.find('.dateselector-month').val();
				
				if ($(this).is('.dateselector-year, .dateselector-month')) {
					that._setDays(year, month, $day.val());
				}
				
				// $day.val() is new value
				that._value(year, month, $day.val());
			});
			
			this._setDateFromField();
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
				year, endYear, month, html;
			
			var determineYear = function(value) {
				var year = (value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) : parseInt(value, 10));
				
				return (isNaN(year) ? thisYear : year);
			};
			
			year = determineYear(years[0]);
			endYear = Math.max(year, determineYear(years[1] || ''));
			
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
			html += '<select class="dateselector-day"></select>';
			
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
		
		_setDays: function(year, month, day) {
			this._$div.find('.dateselector-day')
				.empty().append(this._generateDayOptions(year, month))
				.find('option[value="' + day + '"]').prop('selected', true);
		},
		
		_refresh: function() {
			var year = this._currentDate.getFullYear(), 
				month = this._currentDate.getMonth(), 
				day = this._currentDate.getDate(), 
				$year, $month, $day;
				
			this._$div.empty().append(this._generateHTML());
			$year = this._$div.find('.dateselector-year');
			$month = this._$div.find('.dateselector-month');
			$day = this._$div.find('.dateselector-day');
			
			// if use .val() pass an nonexistent value, will display blank
			$year.find('option[value="' + year + '"]').prop('selected', true);
			year = $year.val();
			$month.val(month);
			this._setDays(year, month, day);
			this._value(year, month, $day.val());
		},
		
		_value: function(year, month, day) {
			year = parseInt(year, 10);
			month = parseInt(month, 10);
			day = parseInt(day, 10);
			this._currentDate = new Date(year, month, day);
			this._$element.val($.fn.dateselector.utils.formatDate(this._options.dateFormat, this._currentDate));
		},
		
		_setDateFromField: function() {
			var defaultDate = new Date(),
				date;
			
			try {
				date = $.fn.dateselector.utils.parseDate(this._options.dateFormat, this._$element.val()) || defaultDate;
			} catch(event) {
				date = defaultDate;
			}
			
			this._currentDate = date;
		},
		
		option: function(options) {
			$.extend(this._options, options);
			this._refresh();
		},
		
		value: function(year, month, day) {
			var originalDate = this._currentDate, 
				date;
			
			if (arguments.length === 0) {
				return this._$element.val();
			} else if (arguments.length === 1 && typeof year === 'string') {
				try {
					date = $.fn.dateselector.utils.parseDate(this._options.dateFormat, year) || originalDate;
				} catch(event) {
					date = originalDate;
				}
			} else {
				year = parseInt(year, 10);
				month = parseInt(month, 10);
				day = parseInt(day, 10);
				year = (isNaN(year) ? originalDate.getFullYear() : year);
				month = (isNaN(month) ? originalDate.getMonth() : month - 1);
				day = (isNaN(day) ? originalDate.getDate() : day);
				date = new Date(year, month, day);
			}
			
			this._currentDate = date;
			this._refresh();
		}
	};
	
	$.fn.dateselector.utils = {
		isLeapYear: function(year) {
			return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0 );
		},
		
		parseDate: function(format, value) {
			if (value === '') {
				return null;
			}
			
			var year = -1, 
				month = -1, 
				day = -1, 
				iValue = 0, 
				date = new Date(), 
				iFormat, extra, 
				
				lookAhead = function(match) {
					var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
					
					if (matches) {
						iFormat++;
					}
					
					return matches;
				},
				
				getNumber = function(match) {
					var isDoubled = lookAhead(match),
						size = (match === 'y' && isDoubled ? 4 : 2),
						digits = new RegExp('^\\d{1,' + size + '}'),
						num = value.substring(iValue).match(digits);
					
					if (!num) {
						throw 'Missing number at position ' + iValue;
					}
					iValue += num[0].length;
					
					return parseInt(num[0], 10); 
				},
				
				checkLiteral = function() {
					if (value.charAt(iValue) !== format.charAt(iFormat)) {
						throw 'Unexpected literal at position ' + iValue;
					}
					iValue++;
				};
			
			for (iFormat = 0; iFormat < format.length; iFormat++) {
				switch (format.charAt(iFormat)) {
					case 'd':
						day = getNumber('d');
						break;
					case 'm':
						month = getNumber('m');
						break;
					case 'y':
						year = getNumber('y');
						break;
					default:
						checkLiteral();
				}
			}
			
			if (iValue < value.length) {
				extra = value.substr(iValue);
				if (!/^\s+/.test(extra)) {
					throw 'Extra/unparsed characters found in date: ' + extra;
				}
			}
			
			if (year === -1) {
				year = date.getFullYear();
			} else if (year < 100) {
				year += date.getFullYear() - date.getFullYear() % 100;
			}
			
			date = new Date(year, month - 1, day);
			if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
				throw 'Invalid date';
			}
			
			return date;
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
