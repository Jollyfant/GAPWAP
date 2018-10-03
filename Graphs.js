
function projectInclination(inc) {

  /*
   * Function projectInclination
   * Converts the inclination to a project inclination (equal area; equal angle)
   */

  const PROJECTION_TYPE = "AREA";

  var inc = Math.abs(inc);

  switch(PROJECTION_TYPE) {
    case "AREA":
      return 90 - (Math.sqrt(2) * 90 * Math.sin(Math.PI * (90 - inc) / 360));
    case "ANGLE":
      return 90 - (90 * Math.tan(Math.PI * (90 - inc) / 360));
    default:
      throw(new Exception("Unknown projection type requested."));
  }

}

function hemispherePlot(id, distribution) {

  /*
   * Function hemispherePlot
   * Creates a hemisphere plot from a distribution
   */

  function formatLabel() {

    /*
     * Function hemispherePlot::formatLabel
     * Adds degree symbol to the axis labels
     */

    return this.value + DEGREE_SYMBOL;

  }

  function getDIRTooltip() {

    /*
     * Function hemispherePlot::getDIRTooltip
     * Handles tooltip for hemisphere plot
     */

    return new Array(
      "<b>Declination: </b>" + this.x.toFixed(1),
      "<b>Inclination: </b>" + this.point.inc.toFixed(1)
    ).join("<br>");

  }

  function prepareDirectionData(direction) {

    /*
     * Function hemispherePlot::prepareData
     * Prepares directional data (dec, inc) for plotting in hemisphere plot
     */

    return {
      "x": direction.dec,
      "y": projectInclination(direction.inc),
      "inc": direction.inc
    }

  }

  const ENABLE_45_CUTOFF = false;
  const ENABLE_ANIMATION = false;

  if(!(distribution instanceof Distribution)) {
    throw(new Exception("Input is not of class Distribution."));
  }

  var distribution = distribution.rotateTo(0, 0);

  // Create the HighCharts data structures
  var data = distribution.directions.map(prepareDirectionData);
  var mean = new Array(prepareDirectionData(distribution.mean));
    
  Highcharts.chart(id, {
    "chart": {
      "polar": true
    },
    "tooltip": {
      "formatter": getDIRTooltip
    },
    "subtitle": {
      "text": "ChRM Directions",
      "style": { 
        "fontSize": "16px"
      }
    },
    "title": {
      "text": "",
      "style": { 
        "fontSize": "26px"
      }
    },
    "pane": {
      "startAngle": 0,
      "endAngle": 360
    },
    "yAxis": {
      "type": "linear",
      "reversed": true,
      "labels": {
        "enabled": false
      },
      "tickInterval": (ENABLE_45_CUTOFF ? 45 : 90),
      "min": 0,
      "max": 90,
    },
    "credits": {
      "text": "GAPWAP.org (Hemisphere Plot)",
      "href": ""
    },
    "xAxis": {
      "minorTickPosition": "inside",
      "type": "linear",
      "min": 0,
      "max": 360,
      "minorGridLineWidth": 0,
      "tickPositions": [0, 90, 180, 270, 360],
      "minorTickInterval": 10,
      "minorTickLength": 5,
      "minorTickWidth": 1,
      "labels": {
        "formatter": formatLabel
      }
    },
    "plotOptions": {
      "series": {
        "turboThreshold": 0,
        "animation": ENABLE_ANIMATION,
      }
    },
    "series": [{
      "name": "Magnetic Directions",
      "data": data,
      "type": "scatter",
      "marker": {
        "symbol": "circle",
        "lineWidth": 1,
      }
    }, {
      "name": "Mean",
      "data": mean,
      "type": "scatter",
      "marker": {
        "symbol": "circle",
        "lineWidth": 1,
      }
    }]
  });

}