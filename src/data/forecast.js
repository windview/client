
import API from './api';
import Alerts from './alerts';

let Forecast = new function(){

  // TODO get from forecast or configuration
  this.forecastInterval = 15

  /**
    * Loads forecast for all of the farms. Take note! When a single farm
    * fetch job encounters errors this method keeps chugging through the
    * list leaving that farm in place with no forecast. Checking for fetch
    * errors across all farms is not done here!
    *
    * @return a JS Promise that will fulfill when all forecasts for all farms
    * are fetch-resolved
    */
  this.fetchBatchForecast = function(windFarms, timezoom) {
    let queueCount = windFarms.length,
        _self = this;

    return new Promise((resolve, reject) => {
      let forecasts = []
      windFarms.forEach((farm) => {
        _self.fetchForecast(farm, timezoom)
          .then((forecast) => {
            forecasts.push(forecast)
          })
          .catch(error => {
            console.log(error);
            farm.properties.disabled = true;
          })
          .then(() => {
            if(--queueCount === 0) {
              forecasts = _self._coerceForecastsToTimeline(forecasts);
              let meta = _self._getBatchForecastMeta(forecasts);
              resolve({
                data: forecasts,
                meta: meta
              });
            }
          })
      });
    });
  }

  /** Loads the forecast for a given farm out to a given range (timezoom) and
    * post processes that data to detect alerts and other items of note.
    *
    * @return a fetch promise
    */
  this.fetchForecast = (farm, timezoom) => {
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
          const forecastData = this._postProcessForecastData(data, timezoom);
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
  this.getAggregatedForecast = forecasts => {

    if(!forecasts || forecasts.length === 0) return null;

    let masterTimeline = this._getMasterTimeline(forecasts),
        forecastCount = forecasts.length,
        forecastsAtTime = [],
        aggregatedForecast = {
          alerts: {},
          meta: {},
          data: []
        };

    aggregatedForecast.meta = Object.assign({}, forecasts[0].meta, {farm_uuid: "aggregate"});

    masterTimeline.forEach( ts => {
      forecastsAtTime = forecasts.filter(forecast =>  {
        return forecast.data.find( d => {return d.timestamp.getTime() === ts;}) !== undefined;
      })

      let reducedVals = forecastsAtTime.reduce((accumulator, forecast) => {
        let dataPoint = forecast.data.find(d => {return d.timestamp.getTime() === ts;}),
            forecastMW = accumulator.forecastMW + dataPoint.forecastMW,
            actual = undefined;

        if(dataPoint.actual) {
          if(accumulator.actual) {
            actual = dataPoint.actual + accumulator.actual;
          } else {
            actual = dataPoint.actual;
          }
        }

        // actuals may or may not be present
        // Hack for demo purposes
        const fakeNow = window.fakeNow;
        if(fakeNow && ts >= fakeNow) {
          actual = undefined
        }
        // End hack
        return {
          actual: actual,
          forecastMW: forecastMW
        };
      }, {actual: 0, forecastMW: 0})

      // TODO normalize by number of farms relative to the number with data
      if(forecastsAtTime.length !== forecastCount) {
        reducedVals.actual = reducedVals.actual/forecastsAtTime.length*forecastCount;
        reducedVals.forecastMW = reducedVals.forecastMW/forecastsAtTime.length*forecastCount;
      }

      aggregatedForecast.data.push({
        timestamp: new Date(ts),
        forecastMW: Math.round(reducedVals.forecastMW*1000)/1000,
        actual: Math.round(reducedVals.actual*1000)/1000,
        ramp: false,
        rampSeverity: null
      })
    })

    aggregatedForecast.data = Alerts.detectRampsInForecast(aggregatedForecast.data);
    aggregatedForecast.alerts = Alerts.getAlertsForForecast(aggregatedForecast);

    return aggregatedForecast;
  }

  // The latest timestamp in all the data for all the farms
  this.getDataEnd = (forecasts, interval) => {
    let ts = 0;
    forecasts.forEach( forecast => {
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

  this.getForecastForFarm = (fid, forecasts) => {
    let retval = null;
    if( fid && forecasts && forecasts.length > 0) {
      retval = forecasts.find(fc=>fc.meta.farm_uuid === fid)
    }
    return retval || null;
  }

  /* Set the currentForecast property of each provided farm to the value at
   * or soonest after (within 15 minutes of) the provided timestamp
   */
  this.setCurrentForecastByTimestamp = (ts, windFarmFeatures) => {
    if(!ts) return;

    windFarmFeatures.forEach(farm => {
      let currentForecast = farm.properties.forecastData.data.find(dataPoint => {
        return dataPoint.timestamp.getTime() === ts;
      });
      if(!currentForecast) {
        // This is needed to wipe props while we are operating on the actual
        // object used in styling the map
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

      // A limitation of MapboxGL is that it doesn't support nested properties
      // in styles, so we have to promote any prop used in a style to the top
      // TODO format the data for the map in the map instead of forcing
      // a substandard data format onto the redux state like this
      Object.assign(farm.properties, currentForecast);
      farm.properties.currentForecast = currentForecast;
    });
  }

  this.setSelectedFeature = (feature, features) => {
    features.forEach(f=>{f.properties.selected = false});
    feature.properties.selected = true;
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  // Private methods
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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

  /**
    * Calculates a single timeline for all of the provided forecasts then
    * applies that timeline to the data. The end result is that all of the
    * forecasts are aligned in time. If a forecast has data points at a more
    * frequent interval than the master timeline extra points will be dropped
    * from the forecast
    *
    * Alignment is conducted by finding the first and last data point, which are
    * rounded down/up respectively to the nearest even intersection with the
    * configured forecast interval. A master timeline is then constructed
    * by creating a new Date at each interval between the start time and
    * end time. Then each forecast is coerced to align with this master
    * timeline by adjusting the forecast data points timestamp to be
    * equal to the closest master timeline data point and dropping extra points
    * where the forecsat interval is < the master timeline interval.
    *
    * For example, if the first data point is 8:03 and the last data point is
    * 16:28 and the configured interval is 30, the master timeline would include
    * 800, 830, 900, 930, 1000, 1030, etc, 1400, 1430, 1500, 1530, 1600, 1630
    */
  this._coerceForecastsToTimeline = forecasts => {
    let interval = this.forecastInterval,
        intervalMillisec = interval*60*1000,
        masterTimeline = this._getMasterTimeline(forecasts);

    // Coerce the farm values
    forecasts.forEach(f => {
      let newData = [];
      masterTimeline.forEach( masterTime => {
        let foundData = f.data.find( data => {
          return (Math.abs(masterTime - data.timestamp.getTime()) <= (intervalMillisec/2));
        });
        if(foundData) {
          foundData = Object.assign({}, foundData, {timestamp: new Date(masterTime)});
          newData.push(foundData);
        }
      }, this);
      f.data = newData;
    }, this);

    return forecasts;
  }

  this._convertTimestampToDate  = function(ts) {
    return new Date(ts);
  }

  // Create a master timeline of ms since 1970 NOT Date objects
  this._getMasterTimeline = forecasts => {
    let interval = this.forecastInterval,
        intervalMillisec = interval*60*1000,
        firstTime = this.getDataStart(forecasts, interval).getTime(),
        lastTime = this.getDataEnd(forecasts, interval).getTime(),
        pointCount = (lastTime-firstTime)/intervalMillisec,
        masterTimeline = null;

    // Create a master timeline of ms since 1970 NOT Date objects
    masterTimeline = Array.apply(null, {length: pointCount}).map((val, i) => {
      return (firstTime + i * intervalMillisec);
    });

    return masterTimeline;
  }

  /**
    * Invoke formating on an array of forecast data points for a single farm
    */
  this._formatForecastData = (forecast) => {
    let formattedData = [];
    //remove the header row
    forecast.data.shift();
    // Loop through and process the data, outputting a format consumable by the app
    forecast.data.forEach((dataPoint) => {
      formattedData.push(this._formatForecastDataPoint(dataPoint));
    }, this);
    return formattedData;
  }

  /**
    * Formats the raw forecsat data for a single data point including
    *  - Convert array to JS Object
    *  - Rounding numbers
    *  - Converting timestamp string to Date object
    */
  this._formatForecastDataPoint = (dataPoint) => {
    let actual = dataPoint[4] ? Math.round(dataPoint[4]*1000)/1000 : null,
        ts     = this._convertTimestampToDate(dataPoint[0]);

    // Hack for demo purposes
    const fakeNow = window.fakeNow;
    if(fakeNow) {
      actual = ts.getTime() > fakeNow ? null : Math.round(dataPoint[4]*1000)/1000;
    }
    // End hack

    return {
      timestamp: ts,
      forecastMW: Math.round(dataPoint[1]*1000)/1000,
      forecast25MW: Math.round(dataPoint[2]*1000)/1000,
      forecast75MW: Math.round(dataPoint[3]*1000)/1000,
      actual: actual,
      ramp: false,
      rampSeverity: null
    };
  }

  this._getBatchForecastMeta = (forecasts) => {
    return {
      dataEnd: this.getDataEnd(forecasts, this.forecastInterval),
      dataStart: this.getDataStart(forecasts, this.forecastInterval),
      interval: this.forecastInterval
    }
  }

  this._postProcessForecastData = (forecast, timezoom) => {
    let formattedData = this._formatForecastData(forecast);
    formattedData = this._applyTimezoom(timezoom, formattedData);
    forecast.data = Alerts.detectRampsInForecast(formattedData);
    forecast.alerts = Alerts.getAlertsForForecast(forecast);
    return forecast;
  }
}();

export default Forecast;
