var Site = function(latitude, longitude) {

  /*
   * Class Site
   * Container class for site locations
   */

  this.latitude = latitude;
  this.longitude = longitude;

}

Site.prototype.poleFrom = function(direction) {

  /*
   * Function Pole.directionAt
   * Returns the pole for this site from a given direction
   */

  // Confirm input
  if(!(direction instanceof Direction)) {
    throw(new Exception("Input is not of class Direction."));
  }

  console.log(direction instanceof Direction)
  var slat = this.latitude * RADIANS;
  var slong = this.longitude * RADIANS;

  var dec = direction.dec * RADIANS;
  var inc = direction.inc * RADIANS;

  var p = 0.5 * Math.PI - Math.atan(0.5 * Math.tan(inc));
  var plat = Math.asin(Math.sin(slat) * Math.cos(p) + Math.cos(slat) * Math.sin(p) * Math.cos(dec))
  var beta = Math.asin(Math.sin(p) * Math.sin(dec) / Math.cos(plat));

  if(isNaN(beta)) {
    beta = 0;
  }

  if((Math.cos(p) - Math.sin(plat) * Math.sin(slat)) < 0) {
    var plong = slong - beta + Math.PI;
  } else {
    var plong = slong + beta;
  }
	
  plat = plat / RADIANS;
  plong = (plong / RADIANS) % 360;

  // Bind the plate longitude between [0, 360]
  if(plong < 0) {
    plong += 360;
  }

  return new Pole(plat, plong);

}
