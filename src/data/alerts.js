import CONFIG from './config';
const POWER_RAMP = 'rampThresholds',
      PERCENT_CAPACITY_RAMP = 'aggregationRampThresholds';

let clearAlerts = forecast => {
  delete forecast.alerts;
  forecast.data.forEach(d=>{
    d.ramp = false;
    d.rampSeverity = null;
  });
  return forecast;
}

/* Calculate the start and end of each ramp event as
 * well as any interesting details related to each. This
 * method is quite leaky as it assumes a good bit of knowledge
 * about the array of forecast data that is included in the
 * provided windFarm. Output is an array of these:
 *  {
      startTime: Date,
      endTime: Date,
      severity: integer,
      increments: Array of ints
    }
 */
let calculateRampBins = forecastData => {
  forecastData = forecastData.data;
  let rampBins = [];
  // Old school for loop so we can adjust i from within the loop
  for( let i=0; i<forecastData.length; i++ ) {
    let rampBin = null,
        timeslice = forecastData[i],
        direction,
        increment;

    if(timeslice.ramp) {
      // define the base rampBin object. We know that
      // the first ramp timeslice is the beginning of
      // an event, so has no severity or increments
      rampBin = {
        startTime: timeslice.timestamp,
        endTime: null,
        severity: 0,
        direction: null,
        //increments: [0],
      }
      // now the sneaky part... hijack the value for i and loop through subsequent
      // timeslices to find each increment and eventualy the end of the ramp event
      let nextTimeslice = forecastData[++i];
      while(nextTimeslice && nextTimeslice.ramp) {
        increment = nextTimeslice.rampForecastMW - timeslice.rampForecastMW;
        direction = increment > 0 ? 'up' : 'down';
        // Assign direction if it wasn't previously established
        if(!rampBin.direction) rampBin.direction = direction;
        // Ramp continues in the same direction
        if(rampBin.direction === direction) {
          rampBin.severity = rampBin.severity < nextTimeslice.rampSeverity ? nextTimeslice.rampSeverity : rampBin.severity;
          rampBin.endTime = nextTimeslice.timestamp;
          //rampBin.increments.push(increment);
          timeslice = nextTimeslice;
          nextTimeslice = forecastData[++i];
        } else {
          // Ramp has switched direction, treat it like a new ramp winding back
          // i just enough to make sure the next ramp starts at the beginning
          i-=2;
          break;
        }
      }
      rampBins.push(rampBin);
    }
  }
  return rampBins;
}

let calculateCumulativeRampDirection = (forecastData) => {
  let upCount = 0,
      downCount = 0,
      direction = null;
  forecastData.data.forEach(d=>{
    if(d.rampDirection === "up") upCount++;
    if(d.rampDirection === "down") downCount++;
  });
  if(upCount > 0 || downCount > 0) {
    direction = upCount > downCount ? "up" : "down";
  }
  return direction;
}

/** Calculates if each timeslice represents a ramp of some severity
  * using configured ramp thresholds:
  rampThresholds = [{
    level: 'low',
    powerChange: 1,
    timeSpan: 60,
    color: "yellow"
  },{
    level: 'critical',
    powerChange: 2,
    timeSpan: 120,
    color: "red"
  }];
  */
let detectRampsInForecast = (timeslices, rampConfigType) => {

  let rampConfigs = CONFIG.get(rampConfigType),
      totalCapacity = CONFIG.totalCapacity,
      previous, // a placeholder for the comparison timeslice
      level, // the severity of the ramp in question
      time, // time between time slices used to determine a ramp
      distance, // difference in index # of time slices used to determine a ramp
      threshold, // ramping threshold
      diff, // calculated difference in forecast power
      direction; // calculated direction of ramp event (up/down)

  // Assuming that ramp configs go from less severe to more severe. This
  // means we allow ourselves to overwrite ramps from previous iterations
  // in subsequent iterations since it is logical that a severe alert will
  // also trigger a mild alert, but the severe alert is the one we keep
  rampConfigs.forEach(conf=>{
    level = conf.level;
    time = conf.timeSpan;
    // valid config time will always be evenly divisible by forecastInterval
    distance = Math.floor(time/CONFIG.get('forecastInterval'));
    threshold = conf.powerChange;

    timeslices.forEach((timeslice, i) => {
      // Basically ignore the first n records where a valid comparison is not
      // possible yet depending on the distance between relevant slices
      if(i-distance > -1) {
        previous = timeslices[i-distance];
        diff = parseFloat(timeslice.rampForecastMW - previous.rampForecastMW);
        direction = diff > 0 ? 'up' : 'down';
        if(rampConfigType === PERCENT_CAPACITY_RAMP) {
          // Calc the difference in terms of a percentage of total capacity
          diff = Math.abs(diff)/totalCapacity*100;
        }
        // if the change in power is greater than r going up or down
        if(Math.abs(diff) >= threshold) {
          timeslice.ramp = true;
          timeslice.rampSeverity = level;
          timeslice.rampDirection = direction;
          // the previous timeslice(s) represents the beginning of the ramp event. Since we
          // don't know how many steps are between we loop it
          for(let x=i-distance; x<i; x++) {
            timeslices[x].ramp = true;
            timeslices[x].rampSeverity = level;
            timeslices[x].rampDirection = direction;
          }
        }
      }
    });
  });

  return timeslices;
}

// Does no calculations, simply returns the first forecast
// data slice with ramp=true
let getFirstRamp = forecastData => {
  forecastData = forecastData.data;
  return forecastData.find((timeslice)=>{ return timeslice.ramp === true; });
}

// Does no calculations, simply returns the timestamp of the first
// forecast data slice with ramp=true
let getFirstRampStart = forecastData => {
  const firstRamp = getFirstRamp(forecastData);
  return firstRamp ? firstRamp.timestamp : null;
}

// Does no calculations, simply returns the max severity of all previously
// calculated ramps in this forecast
let getMaxRampSeverity = forecastData => {
  forecastData = forecastData.data;
  let maxSeverity = 0,
      rampEvents = forecastData.filter(function(timeslice){ return timeslice.ramp;});
  rampEvents.forEach(function(r){
    maxSeverity = r.rampSeverity > maxSeverity ? r.rampSeverity : maxSeverity;
  });
  return maxSeverity;
};

// Does no calculations, simply looks if any time slices have ramp=true
let hasRamp = forecastData => {
  forecastData = forecastData.data;
  return forecastData.find((timeslice)=>{ return timeslice.ramp; }) !== undefined;
}

// Collects alert data into object structure that can be used for display
// at various points in the app. Does some calculations via invoking
// calculateRampBins
let getAlertsForForecast = forecastData => {
  let ramp = hasRamp(forecastData),
      alerts = {
        rampStart: null,
        hasRamp: ramp,
        maxRampSeverity: null,
        rampBins: [],
        rampDirection: null
      };
  if(ramp) {
    alerts.rampStart = getFirstRampStart(forecastData);
    alerts.maxRampSeverity = getMaxRampSeverity(forecastData);
    alerts.rampBins =calculateRampBins(forecastData);
    alerts.rampDirection = calculateCumulativeRampDirection(forecastData);
  }
  return alerts;
}

module.exports = {
  calculateRampBins: calculateRampBins,
  calculateCumulativeRampDirection: calculateCumulativeRampDirection,
  clearAlerts: clearAlerts,
  detectRampsInForecast: detectRampsInForecast,
  getAlertsForForecast: getAlertsForForecast,
  getFirstRamp: getFirstRamp,
  getFirstRampStart: getFirstRampStart,
  getMaxRampSeverity: getMaxRampSeverity,
  hasRamp: hasRamp,
  POWER_RAMP: POWER_RAMP,
  PERCENT_CAPACITY_RAMP: PERCENT_CAPACITY_RAMP
}
