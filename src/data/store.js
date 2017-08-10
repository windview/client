import WindFarm from './wind-farm';

let Store = new function() {

  // this.apiBaseUrl = process.env.API_URL + "/data";
  this.apiBaseUrl = (() => {
    let c = process.env.API_URL,
        r;
    if(c === "//") {
      r = window.location.href
    } else {
      r = c;
    }
    return `${r}/data`;
  })();

  this.getBatchForecast = function(windFarms, timezoom, callback, callbackScope) {
    let queueCount = windFarms.length;
    // TODO move post processing routine into getForecast method
    windFarms.forEach(function(farm) {
      this.getForecast(farm.properties.fid)
      .always(function(data, status) {
        if(status === "success") {
          const forecastData = WindFarm.postProcessForecastData(data, timezoom);
          farm.properties.forecastData = forecastData;
          farm.properties.rampStart = WindFarm.getFirstRampStart(farm);
          farm.properties.hasRamp = WindFarm.hasRamp(farm);
          farm.properties.maxRampSeverity = WindFarm.getMaxRampSeverity(farm);
          farm.properties.rampBins = WindFarm.calculateRampBins(farm);
        }
        queueCount--;
        if(queueCount === 0) {
          callback.call(callbackScope);
        }
      });
    }, this);
  }

  // Returns a JQuery promise
  this.getForecast = (windFarmFID) => {
    const forecastUrl = this.apiBaseUrl + "/" + windFarmFID + ".json"
    // TODO return own promise, capturing the jquery result and
    // performing post processing
    return $.getJSON(forecastUrl);
  }

  this.getQueryParam = (paramName) => {
    let parts = window.location.href.split("?"),
        retval = null;
    if(parts.length > 1) {
      parts = parts[1].split("&");
      if(parts.length > 0) {
        retval = parts.find(p=>{return p.split("=")[0] === paramName})
        retval = retval ? retval.split("=")[1] : null;
      }
    }
    return retval;
  }

  /* Assuming that farm features are already fully loaded
   * and processed... we just slice out the appropriate
   * amount of data and apply it to the object.
   */
  this.getDataForTimezoom = (timezoom, farmFeatures) => {

  }

  // Returns a JQuery promise
  this.getWindFarms = function() {
    const windFarmUrl = this.apiBaseUrl + "/usgs_wind_farms.geo.json";
    return $.getJSON(windFarmUrl);
  }

  this.getWindFarmById = (fid, farms) => {
    return farms.find((farm)=>{ return farm.properties.fid === fid; });
  }

  // Super hacky just for hte demo on May 5, 2017
  this.setGlobalFakeNow = () => {
    let n = this.getQueryParam("n"),
        now = 0;
    switch(n) {
      case '1':
        now = 1492192800000;
        break;
      case '2':
        now = 1492209000000;
        break;
      case '3':
        now = 1492219800000;
        break;
      default:
        now = 1492168500000;
    }
    window.fakeNow = now;
  }
}();

export default Store;
