
let WindFarm = new function() {

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

  this.getFirstRamp = (windFarm) => {
    const forecastData = windFarm.properties.forecastData.data;
    return forecastData.find((timeslice)=>{ return timeslice.ramp === true; });
  }

  this.getFirstRampStart = (windFarm) => {
    return this.getFirstRamp(windFarm).timestamp; 
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

  this.postProcessForecastData = (forecast) => {
    const fakeNow = window.fakeNow;
    let formattedData = [],
        actual = null,
        ts = null;
    //remove the header row 
    forecast.data.shift();
    forecast.data.forEach(function(timeslice){
      ts = this._convertTimestampToDate(timeslice[0]);
      if(fakeNow) {
        actual = ts.getTime() > fakeNow ? null : Math.round(timeslice[4]*1000)/1000;
      } else {
        actual = Math.round(timeslice[4]*1000)/1000;
      }
      let formattedSlice = {
        timestamp: ts,
        forecastMW: Math.round(timeslice[1]*1000)/1000,
        forecast25MW: Math.round(timeslice[2]*1000)/1000,
        forecast75MW: Math.round(timeslice[3]*1000)/1000,
        actual: actual,
        ramp: false,
        rampSeverity: null
      };
      formattedData.push(formattedSlice);
    }, this);
    forecast.data = this._detectRampsInForecast(formattedData);
    return forecast;
  }

  /* Set the currentForecast property of each provided farm to the value at
   * or soonest after (within 15 minutes of) the provided timestamp
   */
  this.setCurrentForecastByTimestamp = (ts, windFarmFeatures) => {
    windFarmFeatures.forEach(farm=>{
      let currentForecast = farm.properties.forecastData.data.find(data=>{
        return (data.timestamp.getTime() >= ts) && (data.timestamp.getTime()-ts < 1000*60*15);
      });
      // TODO there's got to be a better way of nulling these out when no
      // forecast is available for the given timestamp?
      if(!currentForecast) {
        currentForecast = {
          timestamp: null,
          forecastMW: null,
          forecast25MW: null,
          forecast75MW: null,
          actual: null,
          ramp: false,
          rampSeverity: null,
          disabled: true
        }
      } else {
        currentForecast.disabled = false;
      }
      Object.assign(farm.properties, currentForecast);
    });
  }


  /* Set the currentForecast property of each provided farm to the value at
   * or soonest after (within 15 minutes of) the provided timestamp
   */
  this.setCurrentForecast = (ts, farms) => {
    farms.forEach(farm=>{
      farm.properties.currentForecast = farm.properties.forecastData.data.find(data=>{
        return (data.timestamp.getTime() >= ts) && (data.timestamp.getTime()-ts < 1000*60*15);
      });
      farm.properties.disabled = true; //farm.properties.currentForecast ? false : true;
    });
  }

  this.setSelectedFeature = (feature, features) => {
    features.forEach(f=>{f.properties.selected = false});
    feature.properties.selected = true;
  }

  // Private methods

  this._convertTimestampToDate  = function(ts) {
    return new Date(ts);
  }

  this._detectRampsInForecast = function(timeslices) {
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
}();

export default WindFarm;
