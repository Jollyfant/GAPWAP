var Distribution = function(directions) {

  /*
   * Class Distribution
   * Wrapper for a Fisherian distribution
   */

  this.directions = directions;

  this.mean = this.meanDirection();

  this.R = this.mean.length;
  this.N = directions.length;
  this.K = this.dispersion(this.N, this.R);
  this.A95 = this.confidenceInterval(this.N, this.R);

  this.A95Min = 12 * Math.pow(this.N, -0.40);
  this.A95Max = 82 * Math.pow(this.N, -0.63);

}

Distribution.prototype.dispersion = function(N, R) {

  return (N - 1) / (N - R);

}

Distribution.prototype.confidenceInterval = function(N, R, confidence) {

  // Default to 95%
  if(confidence === undefined) {
    var confidence = 95;
  }

  var p = 0.01 * (100 - confidence);
  return Math.acos(1 - (Math.pow((1 / p), (1 / (N - 1))) - 1) * (N - R) / R) / RADIANS;

}

Distribution.prototype.meanDirection = function() {

  var xSum = ySum = zSum = 0;

  this.directions.forEach(function(direction) {

    var coordinates = direction.toCartesian();

    xSum += coordinates.x;
    ySum += coordinates.y;
    zSum += coordinates.z;

  });

  return new Direction(xSum, ySum, zSum);

}
