"use strict";

const RADIANS = Math.PI / 180;
const PROJECTION_TYPE = "AREA";
const DEGREE_SYMBOL = "\u00B0";
const __DEBUG__ = true;
const __VERSION__ = "0.0.1";

// Example 
// Test branch
// The direction is the mean direction published in the literature

document.getElementById("button-submit").addEventListener("click", function(event) {

  var declination = Number(document.getElementById("input-declination").value);
  var inclination = Number(document.getElementById("input-inclination").value);

  var longitude = Number(document.getElementById("input-longitude").value);
  var latitude = Number(document.getElementById("input-latitude").value);

  var N = Number(document.getElementById("input-number").value);
  var K = Number(document.getElementById("input-dispersion").value);

  var distribution = document.getElementById("input-distribution").value;

  var direction = new Direction(declination, inclination);
  var site = new Site(longitude, latitude);

  if(distribution === "poles") {
    var pole = site.poleFrom(direction);
    var samples = new fisherianDistribution(PoleDistribution, N, K);
    var rotated = samples.rotateTo(pole.lng, pole.lat);
  } else {
    var samples = new fisherianDistribution(DirectionDistribution, N, K);
    var rotated = samples.rotateTo(direction.dec, direction.inc);
  }

  var loc = new Location(site, rotated);

  hemispherePlot("hemispherePlot", loc.directions);
  hemispherePlot("hemispherePlot2", loc.poles);

});

document.getElementById("button-submit").click();
