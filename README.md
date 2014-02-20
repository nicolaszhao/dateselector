# Dateselector

A simple jQuery plugin for date selection.

**Current version:** [1.0.0](https://github.com/nicolaszhao/dateselector/archive/v1.0.0.tar.gz)

## Usage
Include jQuery and the plugin on your page. Then select a input element and call the dateselector method on DOM ready.

	<script src="jquery.js"></script>
	<script src="jquery.dateselector.js"></script>
	<script>
		$(function() {
			$('[name="date"]').dateselector();
		});
	</script>
	<input type="text" name="date" />

## Options
**monthNames** (default: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])   
Type: Array   
The list of full month names, for use as text of options of the month selector.

***

**dateFormat** (default: 'mm/dd/yy')   
Type: String   
The format string for format a select date output to the input element.   
The format can be combinations of the following:   
* d - day of month (no leading zero)
* dd - day of month (two digit)
* m - month of year (no leading zero)
* mm - month of year (two digit)
* y - year (two digit)
* yy - year (four digit)

***

**yearRange** (default: '1949:-10')   
Type: String   
The range of years displayed in the year drop-down: either relative to today's year (`"-nn:+nn"`), absolute (`"nnnn:nnnn"`), or combinations of these formats (`"nnnn:-nn"`). 

## Methods
**option( options )**  
Returns: jQuery   
Set one or more options for the dateselector.
	
* **options**   
	Type: Object   
	A map of option-value pairs to set.
	
**Code example:**
	
	$('[name="date"]').dateselector('option', {dateFormat: 'yy-mm-dd'});
	
***

**value()**  
Returns: String   
Gets the current value as a formatted date.    

**Code example:**
	
	$('[name="date"]').dateselector('value'); // e.g. 02/20/2014
	
***

**value( year[, month] [, day] )**  
Returns: jQuery   
To set the dateselector value.

* **year**    
	Type: Number or String    
	If passed a string and only 1 argument, the value is parsed based on the dateFormat.
	
* **month**   
	Type: Number   
	Set the month of the current date to the value.
	
* **day**   
	Type: Number   
	Set the day of the current date to the value.

**Code examples:**
	
	$('[name="date"]').dateselector('value', '02/20/2014');
	$('[name="date"]').dateselector('value', 2014, 2, 20);



## Theming
If dateselector specific styling is needed, the following CSS class names can be used:
* `.dateselector`: The container of 3 drop-down.
	* `.dateselector-year`: The year drop-down select.
	* `.dateselector-month`: The month drop-down select.
	* `.dateselector-day`: The day drop-down select.

## Dependencies
### Required
[jQuery, tested with 1.10.2](http://jquery.com)

## License
Copyright (c) 2014 Nicolas Zhao; Licensed MIT