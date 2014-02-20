( function($) {
	
	module('dateselector: options');
	
	test('dateFormat', function() {
		var $date = $('#dateselector').dateselector({
				yearRange: '-10:+10',
				dateFormat: 'yy-mm-dd'
			}),
			date = new Date();
		
		equal($date.val(), $.fn.dateselector.utils.formatDate('yy-mm-dd', date), 'yy-mm-dd: ' + $date.val());
		
		$date.dateselector('option', {
			dateFormat: 'm/d/y'
		});
		equal($date.val(), $.fn.dateselector.utils.formatDate('m/d/y', date), 'm/d/y: ' + $date.val());
		
		$date.dateselector('option', {
			dateFormat: 'mm, yy'
		});
		equal($date.val(), $.fn.dateselector.utils.formatDate('mm, yy', date), 'mm, yy: ' + $date.val());
	});
	
	test('yearRange', function() {
		var $date = $('#dateselector').dateselector(),
			thisYear = new Date().getFullYear(),
			
			yearRange = function(format) {
				var $year,
					ret;
				
				$year = $date.dateselector('option', {
					yearRange: format
				}).prev('.dateselector').find('.dateselector-year');
				
				ret = $year.find('option:first').prop('selected', true).end().val();
				$year.find('option:last').prop('selected', true);
				ret += ':' + $year.val();
				return ret;
			};
		
		equal(yearRange('-10:+10'), (thisYear - 10) + ':' + (thisYear + 10), '-10:+10 -> ' + (thisYear - 10) + ':' + (thisYear + 10));
		equal(yearRange('1982:2009'), '1982:2009', 'nnnn:nnnn -> 1982:2009');
		equal(yearRange('1982:-10'), '1982:' + (thisYear - 10), 'nnnn:-10 -> 1982:' + (thisYear - 10));		
	});
	
	module('dateselector: methods');
	
	test('option', function() {
		var $date = $('#dateselector').dateselector();
		
		$date.dateselector('option', {
			dateFormat: 'yy-mm-dd',
			yearRange: '-10:+10'
		});
		equal($date.data('dateselector')._options.dateFormat, 'yy-mm-dd');
		equal($date.data('dateselector')._options.yearRange, '-10:+10');
	});
	
	test('value', function() {
		var $date = $('#dateselector').dateselector({
			yearRange: '1982:-1'
		});
		
		$date.dateselector('value', 1982, 1, 9);
		equal($date.val(), '01/09/1982', 'pass 3 arguments');
		
		$date.dateselector('value', '11/13/2009');
		equal($date.val(), '11/13/2009', 'pass 1 arguments');
		
		equal($date.dateselector('value'), '11/13/2009', 'pass 0 arguments');
	});
	
}(jQuery));
