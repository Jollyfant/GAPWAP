var Pole = function(latitude, longitude) {

  /*
   * Class Pole
   * Container class for pole locations
   */

  this.latitude = latitude;
  this.longitude = longitude;

}

Pole.prototype.directionAt = function(site) {

  /*
   * Function Pole.directionAt
   * Returns the direction for this pole at a given site location
   */

  if(!(site instanceof Site)) {
    throw(new Exception("Input is not of class Site."));
  }

  // Our pole positions are kept  in the data block at positions 0 and 1
  var poleLat = this.latitude;
  var poleLong = this.longitude;

  // Make sure the sites are floats
  var siteLat = site.latitude;
  var siteLong = site.longitude;

  // Make sure siteLong and poleLongitude are similar
  if(siteLong < 0) {
    siteLong += 360;
  }
  
  if(poleLong < 0) {
    poleLong += 360;
  }
  
  // Get some standard variables
  var sinlats = Math.sin(RADIANS * siteLat);
  var coslats = Math.cos(RADIANS * siteLat);
  var sinlatp = Math.sin(RADIANS * poleLat);
  var coslatp = Math.cos(RADIANS * poleLat);
	
  var cosp = sinlatp * sinlats + coslatp * coslats * Math.cos(RADIANS * (poleLong - siteLong));
  var sinp = Math.sqrt(1 - cosp * cosp);
	
  var dec = (Math.acos((sinlatp - sinlats * cosp) / (coslats * sinp))) / RADIANS
	
  if(poleLong > siteLong && (poleLong - siteLong) > 180) {
    dec = 360 - dec;
  }

  if(poleLong < siteLong && (siteLong - poleLong) < 180) {
    dec = 360 - dec;
  }
	
  // Make sure that we are in the right quadrant
  var inc = Math.atan2(2 * cosp, sinp) / RADIANS;

  return new Direction(dec, inc);

}
