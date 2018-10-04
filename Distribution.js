"use strict";

var Distribution = function(vectors) {

  /*
   * Class Distribution
   * Wrapper for a Fisherian distribution
   */

  this.vectors = vectors;

  this.mean = this.meanDirection();

  this.R = this.mean.length;
  this.N = vectors.length;
  this.dispersion = this.getDispersion(this.N, this.R);
  this.confidence = this.confidenceInterval();

}

var fisherianDistribution = function(Class, n, k) {

  function pseudoDirection(vectorType, k) {

    // Get a random declination (0 inclusive; 1 exclusive)
    var x = 2 * Math.PI * Math.random();
	  
    // Get a random inclination
    var L = Math.exp(-2 * k);
    var a = (Math.random() * (1 - L) + L);
    var fac = Math.sqrt(-Math.log(a) / (2 * k));
    var y = 90 - (2 * Math.asin(fac));
    
    // Return the appropriate vector class (Pole or Direction)
    return new vectorType(
      x / RADIANS,
      y / RADIANS
    );

  }

  var vectors = new Array();
	
  // Draw N pseudo-random samples
  for(var i = 0; i < n; i++) { 
    vectors.push(pseudoDirection(Class.prototype.vectorType, k));
  }

  return new Class(vectors);

}

var PoleDistribution = function(poles) {

  /*
   * Class PoleDistribution
   * Wrapper for pole distributions, inherits from Distribution
   */

  Distribution.call(this, poles);

  // Pole distributions have a minimum & maximum expected scatter
  // (see: Deenen et al., 2011)
  this.confidenceMin = 12 * Math.pow(this.N, -0.40);
  this.confidenceMax = 82 * Math.pow(this.N, -0.63);

}

PoleDistribution.prototype = Object.create(Distribution.prototype);
PoleDistribution.prototype.vectorType = Pole;
PoleDistribution.prototype.constructor = PoleDistribution;

var DirectionDistribution = function(directions) {

  /*
   * Class DirectionDistribution
   * Wrapper for directional distributions, inherits from Distribution
   */

  Distribution.call(this, directions);

  this.lambda = this.mean.paleoLatitude();

  // Conversion between dispersion (Cox 1970) & (Creer 1962) of directions & VGPs
  // For comparison purposes only
  this.cox = this.transformCox();
  this.creer = this.transformCreer();

}

DirectionDistribution.prototype = Object.create(Distribution.prototype);
DirectionDistribution.prototype.vectorType = Direction;
DirectionDistribution.prototype.constructor = DirectionDistribution;

DirectionDistribution.prototype.transformCox = function() {

  /*
   * Class DirectionDistribution::transformCox
   * Transform small dispersion (k) to (K) following Cox 1970
   */

  var lambda = this.lambda * RADIANS;

  return 0.5 * this.dispersion * (5 + 3 * Math.pow(Math.sin(lambda), 2)) / Math.pow(1 + 3 * Math.pow(Math.sin(lambda), 2), 2);

}

DirectionDistribution.prototype.transformCreer = function() {

  /*
   * Class DirectionDistribution::transformCreer
   * Transform small dispersion (k) to (K) following Creer 1962
   */

  var lambda = this.lambda * RADIANS;

  return 0.5 * this.dispersion * (5 - 3 * Math.pow(Math.sin(lambda), 2)) / 1 + 3 * Math.pow(Math.sin(lambda), 2);

}

Distribution.prototype.getConfidenceEllipse = function() {

  /*
   * Function Distribution.getConfidenceEllipse
   * Returns confidence ellipse around up North
   */

  // Define the number of discrete points on an ellipse
  const NUMBER_OF_POINTS = 51;

  var vectors = new Array();

  // Create a circle around the pole with angle confidence
  for(var i = 0; i < NUMBER_OF_POINTS; i++) {
    vectors.push(new this.vectorType((i * 360) / (NUMBER_OF_POINTS - 1), 90 - this.confidence));
  }

  // Handle the correct distribution type
  if(this.constructor === PoleDistribution) {
    return new this.constructor(vectors).rotateTo(this.mean.lng, this.mean.lat - 90).vectors;
  } else if(this.constructor === DirectionDistribution) {
    return new this.constructor(vectors).rotateTo(this.mean.dec, this.mean.inc - 90).vectors;
  }

}

PoleDistribution.prototype.toDirections = function(site) {

  /*
   * Function Distribution.toDirections
   * Converts a distribution to poles for a given site
   */

  if(!(site instanceof Site)) {
    throw(new Exception("Input is not of class Site."));
  }

  var directions = this.vectors.map(function(pole) {
    return site.directionFrom(pole);
  });

  return new DirectionDistribution(directions);

}

DirectionDistribution.prototype.toPoles = function(site) {

  /*
   * Function Distribution.toPoles
   * Converts a distribution to poles for a given site
   */

  if(!(site instanceof Site)) {
    throw(new Exception("Input is not of class Site."));
  }

  var poles = this.vectors.map(function(direction) {
    return site.poleFrom(direction);
  });

  return new PoleDistribution(poles);

}

Distribution.prototype.rotateTo = function(azimuth, plunge) {

  /*
   * Function Distribution.rotateTo
   * Rotates a distribution to a specific azimuth, plunge and returns a new distribution
   */

  // Create a new bounded function
  var rotateFunction = this.rotateVector.bind(this, azimuth, plunge);

  // The rotation should return a new Distribution of the same type
  return new this.constructor(this.vectors.map(rotateFunction));

}

Distribution.prototype.rotateVector = function(azimuth, plunge, vector) {

  /*
   * Function Direction.rotateTo
   * Rotates a direction to azimuth, plunge
   */

  // Convert to radians
  var azimuth = azimuth * RADIANS;
  var plunge = plunge * RADIANS;

  // Create the rotation matrix
  var rotationMatrix = new Array(
    new Array(Math.cos(plunge) * Math.cos(azimuth), -Math.sin(azimuth), -Math.sin(plunge) * Math.cos(azimuth)),
    new Array(Math.cos(plunge) * Math.sin(azimuth), Math.cos(azimuth), -Math.sin(plunge) * Math.sin(azimuth)),
    new Array(Math.sin(plunge), 0, Math.cos(plunge))
  );

  // Work with arrays for easy multiplication
  var vector = vector.toCartesian().toArray();

  var rotatedVector = new Array(0, 0, 0);

  // Do matrix-vector multiplication
  // V'i = RijVj (summation convention)
  for(var i = 0; i < 3; i++) {
    for(var j = 0; j < 3; j++) {
      rotatedVector[i] += rotationMatrix[i][j] * vector[j];
    }
  }

  // Return a direction with the rotated vector
  var coordinates = new Coordinates(...rotatedVector);

  // Make sure we use the right constructor
  if(this.constructor === PoleDistribution) {
    return coordinates.toPole(this);
  } else if(this.constructor === DirectionDistribution) {
    return coordinates.toDirection(this);
  } else {
    throw(new Exception("Got unexpected constructor."));
  }

}

Distribution.prototype.getDispersion = function(N, R) {

  /*
   * Function Distribution.confidenceInterval
   * Returns the getDispersion parameter of a distribution
   */

  return (N - 1) / (N - R);

}

Distribution.prototype.confidenceInterval = function(confidence) {

  /*
   * Function Distribution.confidenceInterval
   * Returns the confidence value of a distribution
   */

  var N = this.N;
  var R = this.R;

  // Default to 95% confidence
  if(confidence === undefined) {
    var confidence = 95;
  }

  // Set the probability
  var probability = 0.01 * (100 - confidence);

  return Math.acos(1 - (Math.pow((1 / probability), (1 / (N - 1))) - 1) * (N - R) / R) / RADIANS;

}

Distribution.prototype.meanDirection = function() {

  /*
   * Function Distribution.meanDirection
   * Calculates the mean vector from a set of directions
   */

  var xSum = 0;
  var ySum = 0
  var zSum = 0;

  this.vectors.forEach(function(vector) {

    var coordinates = vector.toCartesian();

    xSum += coordinates.x;
    ySum += coordinates.y;
    zSum += coordinates.z;

  });

  // Return a new direction
  if(this.constructor === DirectionDistribution) {
    return new Coordinates(xSum, ySum, zSum).toDirection();
  } else if(this.constructor === PoleDistribution) {
    return new Coordinates(xSum, ySum, zSum).toPole();
  } else {
    throw(new Exception("Got unexpected constructor."));
  }

}
