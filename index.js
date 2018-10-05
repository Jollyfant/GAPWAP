"use strict";

const RADIANS = Math.PI / 180;
const PROJECTION_TYPE = "AREA";
const DEGREE_SYMBOL = "\u00B0";
const __DEBUG__ = true;

// Example 
// The direction is the mean direction published in the literature
var direction = new Direction(0, 0);

// The site location
var site = new Site(0, 0);

// We want to know the VGP for resampling purposes
var pole = site.poleFrom(direction);

// Ask for a fisherian pole distribution using N, K = 25
var distribution = fisherianDistribution(PoleDistribution, 250, 25);

// Rotate to the appropriate VGP position
var rotated = distribution.rotateTo(pole.lng, pole.lat - 90);

// Create a location
var loc = new Location(site, rotated);

// Show plots
hemispherePlot("hemispherePlot", loc.directions);
hemispherePlot("hemispherePlot2", loc.poles);
