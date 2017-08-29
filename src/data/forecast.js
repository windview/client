
import API from './api';
import Alerts from './alerts';

let Forecast = new function(){

  /**
    * Calculates an aggregated forecast for all of the wind farms
    * provided using their previousl loaded forecast values
    */
  this.getAggregatedForecast = (windFarms) => {
    debugger;
    let forecast = [];
    windFarms.forEach((farm)=>{
      console.log('aggregate in', farm.properties.fid);
      /*
      let formattedSlice = {
        timestamp: ts,
        forecastMW: Math.round(timeslice[1]*1000)/1000,
        forecast25MW: Math.round(timeslice[2]*1000)/1000,
        forecast75MW: Math.round(timeslice[3]*1000)/1000,
        actual: actual,
        ramp: false,
        rampSeverity: null
      };
      */
    }, this);
    return forecast;
  }

  this.getAlertsForForecast = (forecastData) => {
    let alerts = {
      rampStart: Alerts.getFirstRampStart(forecastData),
      hasRamp: Alerts.hasRamp(forecastData),
      maxRampSeverity: Alerts.getMaxRampSeverity(forecastData),
      rampBins: Alerts.calculateRampBins(forecastData)
    }
    return alerts;
  }

  /**
    * Loads forecast for all of the farms. When a single farm fetch errors,
    * this method keeps chugging through the list. Checking for fetch errors
    * across all farms is not done here!
    *
    * @return a JS Promise that will fulfill when all forecasts for all farms
    * are fetch-resolved
    */
  this.getBatchForecast = function(windFarms, timezoom, callback) {
    let queueCount = windFarms.length,
        _self = this;

    return new Promise((resolve, reject) => {
      let forecasts = []
      windFarms.forEach(function(farm) {
        this.getForecast(farm, timezoom)
          .then(
            (forecast) => {
              forecasts.push(forecast)
              if(--queueCount === 0) resolve(forecasts);
            }
          ).catch(error => {
            console.log(error);
            if(--queueCount === 0) resolve(forecasts);
          });
      }, _self);
    });
  }

  /* Assuming that farm features are already fully loaded
   * and processed... we just slice out the appropriate
   * amount of data and apply it to the object.
   */
  this.getDataForTimezoom = (timezoom, farmFeatures) => {
    // TODO Something
  }

  /** Loads the forecast for a given farm out to a given range (timezoom) and
    * post processes that data to detect alerts and other items of note.
    *
    * @return a fetch promise
    */
  this.getForecast = (farm, timezoom) => {
    return API.goFetch(`${farm.properties.fid}.json`)
      .then(
        response => {
          if(response.ok) {
            return response.json();
          } else {
            throw("Error fetching forecast for", farm.properties.fid);
          }
        }
      )
      .then(
        data => {
          const forecastData = this.postProcessForecastData(data, timezoom);
          farm.properties.forecastData = forecastData;
          // A limitation of MapboxGL is that it doesn't support nested properties
          // in styles, so we have to promote any prop used in a style to the top
          farm.properties.maxRampSeverity = forecastData.alerts.maxRampSeverity;
          return forecastData;
        }
      )
  }

  this.postProcessForecastData = (forecast, timezoom) => {
    // Hack for demo purposes
    const fakeNow = window.fakeNow;
    // End hack

    let formattedData = [],
        actual = null,
        ts = null;
    //remove the header row
    forecast.data.shift();
    // Loop through and process the data, outputting a format consumable by the app
    forecast.data.forEach(function(timeslice){
      ts = this._convertTimestampToDate(timeslice[0]);
      // Hack for demo
      if(fakeNow) {
        actual = ts.getTime() > fakeNow ? null : Math.round(timeslice[4]*1000)/1000;
      } else {
        actual = Math.round(timeslice[4]*1000)/1000;
      }
      // End Hack
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

    formattedData = this._applyTimezoom(timezoom, formattedData);
    forecast.data = Alerts.detectRampsInForecast(formattedData);
    forecast.alerts = this.getAlertsForForecast(forecast);
    return forecast;
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

  /* Set the currentForecast property of each provided farm to the value at
   * or soonest after (within 15 minutes of) the provided timestamp
   */
  this.setCurrentForecastByTimestamp = (ts, windFarmFeatures) => {
    windFarmFeatures.forEach(farm=>{
      let currentForecast = null;
      if(ts) {
        currentForecast = farm.properties.forecastData.data.find(data=>{
          return (data.timestamp.getTime() >= ts) && (data.timestamp.getTime()-ts < 1000*60*15);
        });
      }
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
          disabled: ts !== null ? true : false
        }
      } else {
        currentForecast.disabled = false;
      }
      Object.assign(farm.properties, currentForecast);
    });
  }

  this.setSelectedFeature = (feature, features) => {
    features.forEach(f=>{f.properties.selected = false});
    feature.properties.selected = true;
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Private methods
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  this._applyTimezoom = (timezoom, data) => {
    //Calculate data start and data end times
    let dataStart = data[0].timestamp.getTime(),
        dataEnd;
    switch(timezoom) {
      case '8':
        dataEnd = dataStart + 1000*60*60*8;
        break;
      case '16':
        dataEnd = dataStart + 1000*60*60*16;
        break;
      default:
        dataEnd = data[data.length-1].timestamp.getTime();
    }
    return data.filter(d=>{ return d.timestamp.getTime() <= dataEnd; });
  }

  this._convertTimestampToDate  = function(ts) {
    return new Date(ts);
  }
}();

export default Forecast;
