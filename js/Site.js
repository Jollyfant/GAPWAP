"use strict";

var Site = function(longitude, latitude, age) {

  /*
   * Class Site
   * Container class for site locations
   */

  this.latitude = latitude;
  this.longitude = longitude;

  this.age = 10;

}

Site.prototype.poleFrom = function(direction) {

  /*
   * Function Pole.directionAt
   * Returns the pole for this site from a given direction
   */

  // Confirm we are translating a site to a pole
  if(!(direction instanceof Direction)) {
    throw(new Exception("The passed direction is not of class Direction."));
  }

  // Convert to radians
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
	
  // Bind the plate longitude between [0, 360]
  if(plong < 0) {
    plong += 2 * Math.PI;
  }

  return new Pole(
    plong / RADIANS,
    plat / RADIANS
  );

}

Site.prototype.directionFrom = function(pole) {

  /*
   * Function Pole.directionAt
   * Returns the direction for this pole at a given site location
   */

  // Confirm that the constructor is a pole
  if(!(pole instanceof Pole)) {
    throw(new Exception("The passed pole is not of class Pole."));
  }

  // Convert to Radians
  var siteLat = this.latitude * RADIANS;
  var siteLong = this.longitude * RADIANS;
  var poleLat = pole.lat * RADIANS;
  var poleLong = pole.lng * RADIANS

  // Make sure siteLong and pole & site longitudes are in the same domain
  if(siteLong < 0) {
    siteLong += 2 * Math.PI;
  }

  if(poleLong < 0) {
    poleLong += 2 * Math.PI;
  }

  // Get some standard variables
  var cosp = Math.sin(poleLat) * Math.sin(siteLat) + Math.cos(poleLat) * Math.cos(siteLat) * Math.cos(poleLong - siteLong);
  var sinp = Math.sqrt(1 - Math.pow(cosp, 2));

  var declination = Math.acos((Math.sin(poleLat) - Math.sin(siteLat) * cosp) / (Math.cos(siteLat) * sinp));

  // Put in the right quadrant
  if(poleLong > siteLong && (poleLong - siteLong) > Math.PI) {
    declination = 2 * Math.PI - declination;
  }

  if(poleLong < siteLong && (siteLong - poleLong) < Math.PI) {
    declination = 2 * Math.PI - declination;
  }

  // Make sure that we are in the right quadrant
  var inclination = Math.atan2(2 * cosp, sinp);

  return new Direction(
    declination / RADIANS,
    inclination / RADIANS
  );

}
