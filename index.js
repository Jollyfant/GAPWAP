const RADIANS = Math.PI / 180;
const __DEBUG__ = true;

var Coordinates = function(x, y, z) {

  this.x = x;
  this.y = y;
  this.z = z;

  this.length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

}

Coordinates.prototype.toDirection = function() {

  var dec = (360 + (Math.atan2(this.y, this.x) / RADIANS)) % 360; 
  var inc = Math.asin(this.z / this.length) / RADIANS;
	
  return new Direction(
    dec,
    inc,
    this.length
  );


}

var Direction = function(dec, inc, length) {

  this.dec = dec;
  this.inc = inc;

  // Implicitly assume unit weight
  this.length = length || 1;

}

Direction.prototype.toCartesian = function() {

  // Convert dec, inc to radians
  var dec = this.dec * RADIANS;
  var inc = this.inc * RADIANS;

  // Calculate Cartesian coordinates
  return new Coordinates(
    this.length * Math.cos(dec) * Math.cos(inc),
    this.length * Math.sin(dec) * Math.cos(inc),
    this.length * Math.sin(inc)
  );

}

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

  return directions;

}

testData.forEach(function(x) {

  console.log(fisherianDistribution(x.N, x.K));

});

