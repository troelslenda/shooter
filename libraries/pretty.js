/*
 * JavaScript Pretty Date
 * Copyright (c) 2011 John Resig (ejohn.org)
 * Licensed under the MIT and GPL licenses.
 */

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time){
  var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
    diff = (((new Date()).getTime() - date.getTime()) / 1000),
    day_diff = Math.floor(diff / 86400);

  if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
    return;

  return day_diff == 0 && (
    diff < 60 && "lige nu" ||
      diff < 120 && "et minut siden" ||
      diff < 3600 && Math.floor( diff / 60 ) + " minutter siden" ||
      diff < 7200 && "en time siden" ||
      diff < 86400 && Math.floor( diff / 3600 ) + " timer siden") ||
    day_diff == 1 && "igår" ||
    day_diff < 7 && day_diff + " dage siden" ||
    day_diff < 31 && Math.ceil( day_diff / 7 ) + " uger siden";
}

// If jQuery is included in the page, adds a jQuery plugin to handle it as well
if ( typeof jQuery != "undefined" )
  jQuery.fn.prettyDate = function(){
    return this.each(function(){
      var date = prettyDate(this.title);
      if ( date )
        jQuery(this).text( date );
    });
  };