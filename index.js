"use strict";

const RADIANS = Math.PI / 180;
const PROJECTION_TYPE = "AREA";
const DEGREE_SYMBOL = "\u00B0";
const __DEBUG__ = true;

var pseudoDirection = function(Class, k) {

  // Get a random declination (0 inclusive; 1 exclusive)
  var x = 360 * Math.random();
	
  // Get a random inclination
  var L = Math.exp(-2 * k);
  var a = (Math.random() * (1 - L) + L);
  var fac = Math.sqrt((-Math.log(a)) / (2 * k));
  var y = 90 - (2 * Math.asin(fac)) / RADIANS;

  // Return the appropriate vector class (Pole or Direction)
  return new Class.prototype.vectorType(x, y);

}

var fisherianDistribution = function(Class, n, k) {

  var directions = new Array();
	
  // Draw N pseudo-random samples
  for(var i = 0; i < n; i++) { 
    directions.push(new pseudoDirection(Class, k));
  }

  return new Class(directions);

}

// Example 

// The direction is the mean direction published in the literature
var direction = new Direction(34, 20);

// The site location
var site = new Site(100, 34);

// We want to know the VGP for resampling purposes
var pole = site.poleFrom(direction);

// Ask for a fisherian pole distribution using N, K = 25
var distribution = fisherianDistribution(PoleDistribution, 25, 25);

// Rotate to the appropriate VGP position
var rotated = distribution.rotateTo(pole.lng, pole.lat - 90);

// Create a location
var loc = new Location(site, rotated);

// Show plots
hemispherePlot("hemispherePlot", loc.directions);
hemispherePlot("hemispherePlot2", loc.poles);
