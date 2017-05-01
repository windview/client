import WindFarm from './wind-farm';

let Store = new function() {
  this.apiBaseUrl = "http://localhost:8088/data";

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
    return $.getJSON(forecastUrl);
  }

  this.getBatchForecast = function(windFarms, callback, callbackScope) {
    let queueCount = windFarms.length;
    windFarms.forEach(function(farm) {
      this.getForecast(farm.properties.fid)
      .always(function(data, status) {
        if(status === "success") {
          const forecastData = WindFarm.postProcessForecastData(data);
          farm.properties.forecastData = forecastData;
          farm.properties.rampStart = WindFarm.getFirstRamp(farm);
          farm.properties.hasRamp = WindFarm.hasRamp(farm);
          farm.properties.hasDoubleRamp = WindFarm.hasDoubleRamp(farm);
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
