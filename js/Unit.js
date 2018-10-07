function assert(statement) {

  /*
   * Function assert
   * Asserts given statement of throws an Exception
   */

  if(!statement) {
    throw(new Exception("A test has failed."));
  }

}

function testEulerRotation() {

  /*
   * Function testEulerRotation
   * Test the Euler rotation routine
   */

  function testNoRotation() {

    /*
     * Function testNoRotation
     * Test the Euler rotation with rotation angle of 0
     * Assert that no rotation takes place
     */

    var eulerPole = new EulerPole(133, 45, 0);
    var pole = new Pole(33, 23);
    
    var rotatedPole = getRotatedPole(eulerPole, pole);
    
    assert(parseInt(rotatedPole.lng) === 33);
    assert(parseInt(rotatedPole.lat) === 23);

  }

  function testParallelRotation() {

    /*
     * Function testParallelRotation
     * Test the Euler rotation with rotation axis parallel to the pole
     * Assert that no rotation takes place
     */

    var eulerPole = new EulerPole(170, 23, 55);
    var pole = new Pole(170, 23);
    
    var rotatedPole = getRotatedPole(eulerPole, pole);

    assert(parseInt(rotatedPole.lng) === 170);
    assert(parseInt(rotatedPole.lat) === 23);

  }

  function testPositiveRotation() {

    /*
     * Function testPositiveRotation
     * Test the Euler rotation with a positive rotation angle
     * Assert that an expected clockwise rotation takes place
     */

    var eulerPole = new EulerPole(0, 0, 45);
    var pole = new Pole(90, 0);
    
    var rotatedPole = getRotatedPole(eulerPole, pole);

    assert(parseInt(rotatedPole.lng) === 90);
    assert(parseInt(rotatedPole.lat) === 45);

  }

  function testNegativeRotation() {

    /*
     * Function testNegativeRotation
     * Test the Euler rotation with a negative rotation angle
     * Assert that an expected anti-clockwise rotation takes place
     */

    var eulerPole = new EulerPole(0, 0, -45);
    var pole = new Pole(90, 0);
    
    var rotatedPole = getRotatedPole(eulerPole, pole);

    assert(parseInt(rotatedPole.lng) === 90);
    assert(parseInt(rotatedPole.lat) === -45);

  }

  testNoRotation();
  testPositiveRotation();
  testNegativeRotation();
  testParallelRotation();

  return true;

}
