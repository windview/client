
import API from './api';
import Alerts from './alerts';

let Forecast = new function(){

  // TODO get from forecast or configuration
  this.forecastInterval = 15


  /**
    * Calculates an aggregated forecast for all of the wind farms
    * provided using their previously loaded forecast values. The
    * result is an array with a forecast for each available time slice.
    *
    * There are a couple of assumptions here which will be enforced by data
    * manipulation when needed:
    * 1. The timestamps in all the forecasts will be aligned even if it means
    *    coercing them into shape here
    * 2. The forecasts will all have the same number of timestamps. If a
    *    timeslice only has values at one or two farms, that timeslice is
    *    going to have a misleadingly small value
    */
  this.getAggregatedForecast = (forecast) => {

    let startTime = this.getDataStart(forecast),
        endTime = this.getDataEnd(forecast),
        aggregatedForecast = {
          alerts: {},
          meta: {},
          data: []
        };
    aggregatedForecast.meta = Object.assign({}, forecast[0].meta, {farm_uuid: "aggregate"})


    forecast.forEach((f)=>{
      console.log('aggregate in', f);
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
    return aggregatedForecast;
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
    * Loads forecast for all of the farms. Take note! When a single farm
    * fetch job encounters errors this method keeps chugging through the
    * list. Checking for fetch errors across all farms is not done here!
    *
    * @return a JS Promise that will fulfill when all forecasts for all farms
    * are fetch-resolved
    */
  this.getBatchForecast = function(windFarms, timezoom) {
    let queueCount = windFarms.length,
        _self = this;

    return new Promise((resolve, reject) => {
      let forecasts = []
      windFarms.forEach((farm) => {
        _self.getForecast(farm, timezoom)
          .then((forecast) => {
            forecasts.push(forecast)
          })
          .catch(error => {
            console.log(error);
          })
          .then(() => {
            if(--queueCount === 0) {
              let meta = _self.getBatchForecastMeta(forecasts);
              resolve({
                data: forecasts,
                meta: meta
              });
            }
          })
      });
    });
  }

  this.getBatchForecastMeta = (forecasts) => {
    return {
      dataEnd: this.getDataEnd(forecasts, this.forecastInterval),
      dataStart: this.getDataStart(forecasts, this.forecastInterval),
      interval: this.forecastInterval
    }
  }

  /* Assuming that farm features are already fully loaded
   * and processed... we just slice out the appropriate
   * amount of data and apply it to the object.
   */
  this.getDataForTimezoom = (timezoom, farmFeatures) => {
    // TODO Something
  }

  // The latest timestamp in all the data for all the farms
  this.getDataEnd = (data, interval) => {
    let ts = 0;
    data.forEach( forecast => {
      forecast.data.forEach(function(row) {
        ts = row.timestamp.getTime() > ts ? row.timestamp.getTime() : ts;
      });
    });

    let dataEnd = new Date(ts),
        minute = dataEnd.getMinutes(),
        remainder = minute >= interval ? minute%interval : interval-minute;
    dataEnd.setMinutes(minute+=remainder);
    dataEnd.setSeconds(0);
    return dataEnd;
  }

  // The earliest timestamp in all the data for all the farms
  this.getDataStart = (data, interval) => {
    let ts = new Date().getTime() + (1000*60*60*24*365); //1 year in the future
    data.forEach( forecast => {
      forecast.data.forEach(function(row) {
        ts = row.timestamp.getTime() < ts ? row.timestamp.getTime() : ts;
      });
    });

    let dataStart = new Date(ts),
        minute = dataStart.getMinutes(),
        remainder = minute >= interval ? minute%interval : minute;
    dataStart.setMinutes(minute-=remainder);
    dataStart.setSeconds(0);
    return dataStart;
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
          // TODO format the data for the map in the map instead of forcing
          // a substandard data format onto the state like this
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
