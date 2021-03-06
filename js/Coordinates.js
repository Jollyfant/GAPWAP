var Coordinates = function(x, y, z) {

  /*
   * Class Coordinates
   * Wrapper for Cartesian coordinates (x, y, z)
   */

  this.x = x;
  this.y = y;
  this.z = z;

  this.length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

}

Coordinates.prototype.toPole = function() {

  var lng = Math.atan2(this.y, this.x);
  var lat = Math.asin(this.z / this.length);

  // Keep longitude from [0, 360]
  if(lng < 0) {
    lng += 2 * Math.PI;
  }

  return new Pole(
    lng / RADIANS,
    lat / RADIANS,
    this.length
  );

}

Coordinates.prototype.toDirection = function() {

  /*
   * Function Coordinates.toDirection
   * Returns Cartesian coordinates represented as a direction
   */

  var dec = (360 + (Math.atan2(this.y, this.x) / RADIANS)) % 360; 
  var inc = Math.asin(this.z / this.length) / RADIANS;
	
  return new Direction(
    dec,
    inc,
    this.length
  );


}

Coordinates.prototype.toArray = function() {

  /*
   * Function Coordinates.toArray
   * Returns x, y, z represented as a vector
   */

  return new Array(this.x, this.y, this.z);

}
