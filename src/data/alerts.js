

let Alerts = new function() {
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
  this.calculateRampBins = (windFarm) => {
    const forecastData = windFarm.properties.forecastData.data;
    let rampBins = [];
    // Old school for loop so we can adjust i from within the loop
    for( let i=0; i<forecastData.length; i++ ) {
      let rampBin = null,
          timeslice = forecastData[i];
      if(timeslice.ramp) {
        // define the base rampBin object. We know that
        // the first ramp timeslice is the beginning of
        // an event, so has no severity or increments
        rampBin = {
          startTime: timeslice.timestamp,
          endTime: null,
          severity: 0,
          increments: [0]
        }
        // now the sneaky part... hijack the value for i and loop through subsequent
        // timeslices to find each increment and eventualy the end of the ramp event
        let nextTimeslice = forecastData[++i];
        while(nextTimeslice.ramp) {
          // TODO If the ramp changes direction between consecutive slices, treat
          // that as a new rampBin
          rampBin.increments.push(nextTimeslice.forecastMW - timeslice.forecastMW);
          rampBin.severity = rampBin.severity < nextTimeslice.rampSeverity ? nextTimeslice.rampSeverity : rampBin.severity;
          timeslice = nextTimeslice;
          nextTimeslice = forecastData[++i];
        }
        rampBin.endTime = timeslice.timestamp;
        rampBins.push(rampBin);
      }
    }
    return rampBins;
  }

  this.detectRampsInForecast = function(timeslices) {
    let previous = timeslices[0],
        r = 5; // ramping threshold
    timeslices.forEach(function(timeslice, i) {
      const diff = timeslice.forecastMW - previous.forecastMW;
      // if the change in power is greater than r going up or down
      if(diff >= r || diff <= (r*-1)) {
        timeslice.ramp = true;
        // two ramps in a row constitute a severe ramping event
        timeslice.rampSeverity = previous.ramp ? 2 : 1;
        // the previous timeslice represents the beginning of the ramp event
        // Make sure and set this after the above to avoid false severity
        previous.ramp = true;
      }
      previous = timeslice;
    }, this);
    return timeslices;
  }
  
  this.getFirstRamp = (windFarm) => {
    const forecastData = windFarm.properties.forecastData.data;
    return forecastData.find((timeslice)=>{ return timeslice.ramp === true; });
  }

  this.getFirstRampStart = (windFarm) => {
    const firstRamp = this.getFirstRamp(windFarm);
    return firstRamp ? firstRamp.timestamp : null;
  }

  this.getMaxRampSeverity = (windFarm) => {
    let maxSeverity = 0;
    const forecastData = windFarm.properties.forecastData.data,
          rampEvents = forecastData.filter(function(timeslice){ return timeslice.ramp;});
    rampEvents.forEach(function(r){
      maxSeverity = r.rampSeverity > maxSeverity ? r.rampSeverity : maxSeverity;
    });
    return maxSeverity;
  }

  this.hasRamp = (windFarm) => {
    const forecastData = windFarm.properties.forecastData.data;
    return forecastData.find((timeslice)=>{ return timeslice.ramp; }) !== undefined;
  }
}();

export default Alerts;