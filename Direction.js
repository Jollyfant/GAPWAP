var Direction = function(dec, inc, length) {

  /*
   * Class Direction
   * Wrapper for magnetic directions
   */

  this.dec = dec;
  this.inc = inc;

  // Implicitly assume unit weight
  this.length = length || 1;

}

Direction.prototype.unit = function() {

  /*
   * Function Direction.unit
   * Returns the unit vector representation of a direction
   */

  return new Direction(this.dec, this.inc);

}

Direction.prototype.paleoLatitude = function() {

  /*
   * Function Direction.paleoLatitude
   * Returns the paleolatitude calculated from the inclination using the dipole formula
   */

  return Math.atan(Math.tan(this.inc * RADIANS) / 2) / RADIANS;

}

Direction.prototype.toCartesian = function() {

  /*
   * Function Direction.toCartesian
   * Returns the direction in Cartesian coordinates
   */

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

Direction.prototype.rotateTo = function(azimuth, plunge) {

  /*
   * Function Direction.rotateTo
   * Rotates a direction to azimuth, plunge
   */

  // Convert to radians
  var azimuth = azimuth * RADIANS;
  var plunge = plunge * RADIANS;

  // Create the rotation matrix
  var rotationMatrix = [
    [Math.cos(plunge) * Math.cos(azimuth), -Math.sin(azimuth), -Math.sin(plunge) * Math.cos(azimuth)],
    [Math.cos(plunge) * Math.sin(azimuth), Math.cos(azimuth), -Math.sin(plunge) * Math.sin(azimuth)],
    [Math.sin(plunge), 0, Math.cos(plunge)]
  ];

  // Work with arrays for easy multiplication
  var vector = this.toCartesian().toArray();
  var rotatedVector = [0, 0, 0];

  // Do matrix-vector multiplication
  // V'i = RijVj (summation convention)
  for(var i = 0; i < 3; i++) {
    for(var j = 0; j < 3; j++) {
      rotatedVector[i] += rotationMatrix[i][j] * vector[j];
    }
  }

  // Return a direction with the rotated vector
  return new Coordinates(
    rotatedVector[0],
    rotatedVector[1],
    rotatedVector[2]
  ).toDirection();

}