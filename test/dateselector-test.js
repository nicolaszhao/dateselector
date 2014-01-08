( function($) {
	
	module('dateselector: options');
	
	test('dateFormat', function() {
		expect(3);
		
		var $date = $('#dateselector').dateselector({
			dateFormat: 'yy-mm-dd'
		});
		
		equal($date.val(), '1949-01-01', 'yy-mm-dd: ' + $date.val());
		
		$date.dateselector({
			dateFormat: 'm/d/y'
		});
		equal($date.val(), '1/1/49', 'm/d/y: ' + $date.val());
		
		$date.dateselector({
			dateFormat: 'mm, yy'
		});
		equal($date.val(), '01, 1949', 'mm, yy: ' + $date.val());
	});
	
	test('yearRange', function() {
		expect(3);
		
		var $date = $('#dateselector').dateselector(),
			thisYear = new Date().getFullYear(),
			
			yearRange = function(format) {
				var $year,
					ret;
				
				$date.dateselector({
					yearRange: format
				});
				
				$year = $date.prev('.dateselector').find('.dateselector-year');
				
				ret = $year.val();
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
		var $date = $('#dateselector').dateselector(),
			thisYear = new Date().getFullYear();
		
		$date.dateselector('option', {
			dateFormat: 'yy-mm-dd',
			yearRange: '-10:+10'
		});
		equal($date.val(), (thisYear - 10) + '-01-01', $date.val());
	});
	
}(jQuery));
