var EulerPole = function(longitude, latitude, angle) {

  /*
   * Class EulerPole
   * Wrapper for Euler poles that inherit from Pole
   */

  Pole.call(this, longitude, latitude);

  this.angle = angle;

}

EulerPole.prototype = Object.create(Pole.prototype);
EulerPole.prototype.constructor = EulerPole;

function getRotatedPole(eulerPole, pole) {

  /*
   * Function getRotatedPole
   * Rotates a given pole around a given euler pole with rotation omega
   * 
   * Modified after supplementary information Paleolatitude.org
   * @ https://doi.org/10.1371/journal.pone.0126946.s005
   * 
   */

  function nullMatrix() {

    /*
     * Function nullMatrix
     * Returns an empty 2D matrix
     */

    return new Array(nullVector(), nullVector(), nullVector());

  }

  function nullVector() {

    /*
     * Function nullVector
     * Returns an empty 1D vector
     */

    return new Array(0, 0, 0);

  }

  // Convert to radians
  var phiEuler = eulerPole.lng * RADIANS;
  var rotationAngle = eulerPole.angle * RADIANS;
  var thetaEuler = eulerPole.lat * RADIANS;

  var thetaPole = pole.lat * RADIANS;
  var phiPole = pole.lng * RADIANS;
  
  // Construct transformation matrix L
  var L = new Array(
    new Array(Math.cos(phiEuler) * Math.sin(thetaEuler), -Math.sin(phiEuler), Math.cos(phiEuler) * Math.cos(thetaEuler)),
    new Array(Math.sin(phiEuler) * Math.sin(thetaEuler), Math.cos(phiEuler), Math.sin(phiEuler) * Math.cos(thetaEuler)),
    new Array(-Math.cos(thetaEuler), 0, Math.sin(thetaEuler))
  );
  
  // Store reference pole to Cartesian coordinates in P vector
  var P = new Array( 
    Math.cos(phiPole) * Math.cos(thetaPole), 
    Math.sin(phiPole) * Math.cos(thetaPole), 
    Math.sin(thetaPole)
  );
  
  // Construct rotation matrix
  var R = new Array(
    new Array(Math.cos(rotationAngle), Math.sin(rotationAngle), 0),
    new Array(-Math.sin(rotationAngle), Math.cos(rotationAngle), 0),
    new Array(0, 0, 1)
  );

  /*
   * [L] [R] [Lt] <P>
   * Where L is the transformation Matrix (t - transpose) [3x3]
   * R rotation matrix [3x3]
   * P is the vector containing Cartesian coordinates of the reference pole [1x3]
   */
  
  //Multiply [L] with [R] to [M]
  var M = nullMatrix();
  for(var i = 0; i < 3; i++) {
    for(var j = 0; j < 3; j++) {
      for(var k = 0; k < 3; k++) {
        M[i][j] += L[i][k] * R[k][j];
      }
    }
  }
  
  //Multiply [M] with [Lt] to [B]
  var B = nullMatrix();
  for(var i = 0; i < 3; i++) {
    for(var j = 0; j < 3; j++) {
      for(var k = 0; k < 3; k++) {
        B[i][j] += M[i][k] * L[j][k];
      }
    }
  }
  
  //Multiply [B] with <P> to <X>
  var rotatedVector = nullVector();
  for(var i = 0; i < 3; i++) {
    for(var j = 0; j < 3; j++) {
      rotatedVector[i] += B[i][j] * P[j];
    }
  }
  	
  return new Coordinates(...rotatedVector).toPole();

}
