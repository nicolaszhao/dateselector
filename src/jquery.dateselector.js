/*
 * dateselector
 * https://github.com/nicolaszhao/dateselector
 *
 * Copyright (c) 2014 Nicolas Zhao
 * Licensed under the MIT license.
 */

(function($) {

  // Collection method.
  $.fn.dateselector = function() {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.dateselector = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.dateselector.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.dateselector.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].dateselector = function(elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

}(jQuery));
