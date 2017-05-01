
let WindFarm = new function() {

  this.hasRamp = (windFarm) => {
    const forecastData = windFarm.properties.forecastData.data;
    return forecastData.find((timeslice)=>{ return timeslice.upRamp || timeslice.downRamp; }) !== undefined;
  }

  this.hasDoubleRamp = (windFarm) => {
    const forecastData = windFarm.properties.forecastData.data;
    return forecastData.find((timeslice)=>{ return timeslice.doubleRamp; }) !== undefined;
  }

  this.getFirstRamp = (windFarm) => {
    const forecastData = windFarm.properties.forecastData.data;
    return forecastData.find((timeslice)=>{ return timeslice.upRamp || timeslice.downRamp; });
  }

  this.postProcessForecastData = (forecast) => {
    //remove the header row 
    forecast.data.shift();
    let formattedData = [];
    forecast.data.forEach(function(timeslice){
      let formattedSlice = {
        timestamp: this._convertTimestampToDate(timeslice[0]),
        forecastMW: timeslice[1],
        forecast25MW: timeslice[2],
        forecast75MW: timeslice[3],
        upRamp: false,
        downRamp: false,
        doubleRamp: false
      };
      formattedData.push(formattedSlice);
    }, this);
    forecast.data = this._detectRamps(formattedData);
    return forecast;
  }

  this._convertTimestampToDate  = function(ts) {
    return new Date(ts);
  }

  this._detectRamps = function(timeslices) {
    let previousVal = timeslices[0].forecastMW,
        r = 5; // ramping threshold
    timeslices.forEach(function(timeslice, i) {
      const val = timeslice.forecastMW,
            diff = val - previousVal;
      if(diff >= r || diff <= (r*-1)) {
        timeslice.upRamp   = diff > 0 ? diff : false;
        timeslice.downRamp = diff < 0 ? diff : false;
        if((timeslice.downRamp && timeslices[i-1].downRamp) 
            || (timeslice.upRamp && timeslices[i-1].upRamp)){
          timeslice.doubleRamp = true;
        }
      }
      previousVal = val;
    }, this);
    return timeslices;
  }
}();

export default WindFarm;
