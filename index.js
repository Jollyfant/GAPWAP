const RADIANS = Math.PI / 180;
const DEGREE_SYMBOL = "\u00B0";
const __DEBUG__ = true;

var pseudoDirection = function(k) {

  // Get a random declination (0 inclusive; 1 exclusive)
  var dec = 360 * Math.random();
	
  // Get a random inclination
  var L = Math.exp(-2 * k);
  var a = (Math.random() * (1 - L) + L);
  var fac = Math.sqrt((-Math.log(a)) / (2 * k));
  var inc = 90 - (2 * Math.asin(fac)) / RADIANS;
	
  return new Direction(dec, inc);

}

var fisherianDistribution = function(n, k) {

  var directions = new Array();
	
  // Draw N pseudo-random samples
  for(var i = 0; i < n; i++) { 
    directions.push(new pseudoDirection(k));
  }

  return new Distribution(directions);

}

hemispherePlot("hemispherePlot", fisherianDistribution(10, 100));
