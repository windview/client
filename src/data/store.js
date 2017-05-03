import WindFarm from './wind-farm';

let Store = new function() {
  this.apiBaseUrl = process.env.API_URL + "/data";

  // Returns a JQuery promise
  this.getWindFarms = function() {
    const windFarmUrl = this.apiBaseUrl + "/usgs_wind_farms.geo.json";
    return $.getJSON(windFarmUrl);
  }

  this.getWindFarmById = (fid, farms) => {
    return farms.find((farm)=>{ return farm.properties.fid === fid; });
  }

  // Returns a JQuery promise
  this.getForecast = function(windFarmFID) {
    const forecastUrl = this.apiBaseUrl + "/" + windFarmFID + ".json"
    // TODO return own promise, capturing the jquery result and
    // performing post processing
    return $.getJSON(forecastUrl);
  }

  this.getBatchForecast = function(windFarms, callback, callbackScope) {
    let queueCount = windFarms.length;
    // TODO move post processing routine into getForecast method
    windFarms.forEach(function(farm) {
      this.getForecast(farm.properties.fid)
      .always(function(data, status) {
        if(status === "success") {
          const forecastData = WindFarm.postProcessForecastData(data);
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
}();

export default Store;
