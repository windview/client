
import API from './api';
import Alerts from './alerts';
import CONFIG from './config';

let forecasts = [],
    meta = {};

// FIXME for debugging only
window.FORECASTS = ()=>forecasts;
window.FORECAST_META = ()=>meta;


let forecastInterval = CONFIG.forecastInterval;

// The latest timestamp in all the data for all the farms
let getDataEnd = () => {
  let ts = 0;
  forecasts.forEach( forecast => {
    forecast.data.forEach(function(row) {
      ts = row.timestamp.getTime() > ts ? row.timestamp.getTime() : ts;
    });
  });

  let dataEnd = new Date(ts),
      minute = dataEnd.getMinutes(),
      interval = CONFIG.forecastInterval,
      remainder = minute >= interval ? minute%interval : interval-minute;
  dataEnd.setMinutes(minute+=remainder);
  dataEnd.setSeconds(0);
  return dataEnd;
}

// The earliest timestamp in all the data for all the farms
let getDataStart = () => {
  let ts = new Date().getTime() + (1000*60*60*24*365); //1 year in the future
  forecasts.forEach( forecast => {
    forecast.data.forEach(function(row) {
      ts = row.timestamp.getTime() < ts ? row.timestamp.getTime() : ts;
    });
  });

  let dataStart = new Date(ts),
      minute = dataStart.getMinutes(),
      interval = CONFIG.forecastInterval,
      remainder = minute >= interval ? minute%interval : minute;
  dataStart.setMinutes(minute-=remainder);
  dataStart.setSeconds(0);
  return dataStart;
}

let getForecasts = () => forecasts;

let getForecastById = (fid) => {
  return getForecasts().find((forecast)=>{ return forecast.id === fid; });
}

// Create a master timeline of ms since 1970 NOT Date objects
let getMasterTimeline = forecasts => {
  let interval = forecastInterval,
      intervalMillisec = interval*60*1000,
      firstTime = getDataStart(forecasts, interval).getTime(),
      lastTime = getDataEnd(forecasts, interval).getTime(),
      pointCount = (lastTime-firstTime)/intervalMillisec,
      masterTimeline = null;

  // Create a master timeline of ms since 1970 NOT Date objects
  masterTimeline = Array.apply(null, {length: pointCount}).map((val, i) => {
    return (firstTime + i * intervalMillisec);
  });

  return masterTimeline;
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
let _coerceForecastsToTimeline = forecasts => {
  let interval = forecastInterval,
      intervalMillisec = interval*60*1000,
      masterTimeline = getMasterTimeline(forecasts);

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

let _convertTimestampToDate  = function(ts) {
  return new Date(ts);
}

/**
  * Formats the raw forecsat data for a single data point including
  *  - Convert array to JS Object
  *  - Rounding numbers
  *  - Converting timestamp string to Date object
  */
let _formatProbabilisticForecastDataPoint = (dataPoint) => {
  let best = Math.round(dataPoint[3]*1000)/1000,
      timestamp = _convertTimestampToDate(dataPoint[0]),
      actual = null;

  if(CONFIG.fakeActuals) {
    if(CONFIG.now > timestamp.getTime()) {
      actual = best+.2;
    }
  }

  return {
    type: 'probabilistic',
    timestamp: timestamp,
    prob1stQuantForecastMW: Math.round(dataPoint[1]*1000)/1000,
    prob25thQuantForecastMW: Math.round(dataPoint[2]*1000)/1000,
    prob50thQuantForecastMW: best,
    prob75thQuantForecastMW: Math.round(dataPoint[4]*1000)/1000,
    prob99thQuantForecastMW: Math.round(dataPoint[5]*1000)/1000,
    bestForecastMW: best,
    actual: actual,
    // ramping
    rampForecastMW: best,
    ramp: false,
    rampSeverity: null,
  };
}

let _formatPointForecastDataPoint = (dataPoint) => {
  let best = Math.round(dataPoint[1]*1000)/1000,
      actual = null;

  if(CONFIG.fakeActuals) {
    actual = best;
  }

  return {
    type: 'point',
    timestamp: _convertTimestampToDate(dataPoint[0]),
    bestForecastMW: best,
    actual: actual,

    // ramping
    rampForecastMW: best,
    ramp: false,
    rampSeverity: null,

    // null these out for consistency
    prob1stQuantForecastMW: null,
    prob25thQuantForecastMW: null,
    prob50thQuantForecastMW: null,
    prob75thQuantForecastMW: null,
    prob99thQuantForecastMW: null,
  };
}

/**
  * Invoke formating on an array of forecast data points for a single farm
  */
let _formatForecastData = (forecast) => {
  let formattedData = [];
  if (forecast.type === "probabilistic") {
    forecast.data.forEach((dataPoint) => {
      formattedData.push(_formatProbabilisticForecastDataPoint(dataPoint));
    }, this);
  } else {
    forecast.data.forEach((dataPoint) => {
      formattedData.push(_formatPointForecastDataPoint(dataPoint));
    }, this);
  }
  return formattedData;
}

let _getBatchForecastMeta = (forecasts) => {
  return {
    dataEnd: getDataEnd(forecasts, forecastInterval),
    dataStart: getDataStart(forecasts, forecastInterval),
    interval: forecastInterval
  }
}

let _postProcessForecastData = (forecast) => {
  let formattedData = _formatForecastData(forecast);
  forecast.data = Alerts.detectRampsInForecast(formattedData);
  forecast.alerts = Alerts.getAlertsForForecast(forecast);
  return forecast;
}

/** Loads the forecast for a given farm and post processes that data to
  * detect alerts and other items of note.
  *
  * @return a fetch promise
  */
let fetchForecast = (farm) => {
  let forecasts = getForecasts();
  return API.goFetch(`/forecasts/latest?type=probabilistic&farm_id=${farm.id}`)
    .then(
      response => {
        if(response.ok) {
          // returns a promise, not a JSON obj
          return response.json();
        } else {
          throw("Error fetching forecast for", farm.id);
        }
      }
    )
    .then(
      data => {
        let forecastData = _postProcessForecastData(data.forecast);
        farm.forecastId = forecastData.id;
        forecasts.push(forecastData);

        // This will become the argument in subsequent promise chains (.thens)
        return forecastData;
      }
    )
}

/**
  * Loads forecast for all of the farms. Take note! When a single farm
  * fetch job encounters errors this method keeps chugging through the
  * list leaving that farm in place with no forecast. Checking for fetch
  * errors across all farms is not done here!
  *
  * @return a JS Promise that will fulfill when all forecasts for all farms
  * are fetch-resolved
  */
let fetchBatchForecast = function(windFarms) {
  let queueCount = windFarms.length,
      _self = this;

  return new Promise((resolve, reject) => {
    windFarms.forEach((farm) => {
      fetchForecast(farm)
        .catch(error => {
          console.log(error);
          farm.disabled = true;
        })
        .then(() => {
          if(--queueCount === 0) {
            forecasts = _coerceForecastsToTimeline(forecasts);
            meta = _getBatchForecastMeta(forecasts);

            resolve({
              data: forecasts,
              meta: meta
            });
          }
        })
    });
  });
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
let getAggregatedForecast = (forecasts) => {

  if(!forecasts || forecasts.length === 0) return null;

  let masterTimeline = getMasterTimeline(forecasts),
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
          forecastMW = accumulator.forecastMW + dataPoint.bestForecastMW,
          actual = undefined;

      if(dataPoint.actual) {
        if(accumulator.actual) {
          actual = dataPoint.actual + accumulator.actual;
        } else {
          actual = dataPoint.actual;
        }
      }

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
      type: "aggregate",
      timestamp: new Date(ts),
      forecastMW: Math.round(reducedVals.forecastMW*1000)/1000,
      rampForecastMW: Math.round(reducedVals.forecastMW*1000)/1000,
      actual: Math.round(reducedVals.actual*1000)/1000,
      ramp: false,
      rampSeverity: null
    });
  });

  aggregatedForecast.data = Alerts.detectRampsInForecast(aggregatedForecast.data);
  aggregatedForecast.alerts = Alerts.getAlertsForForecast(aggregatedForecast);

  return aggregatedForecast;
}

let getForecastForFarm = (fid) => {
  let retval = null,
      forecasts = getForecasts();

  if( fid && forecasts && forecasts.length > 0) {
    retval = forecasts.find(fc=>fc.farm_id === fid)
  }
  return retval;
}

let getForecastForTime = (timestampMS, forecast) => {
  return (forecast && timestampMS) ? forecast.data.find(f=>f.timestamp.getTime()===timestampMS) : null;
}

let getAllAlerts = () => {
  let forecasts = getForecasts();
  let alertDisplayArray = [];

  forecasts.forEach((forecast) => {
    if (forecast.alerts.hasRamp) {
      alertDisplayArray.push(forecast.farm_id)
    }
  });
  return alertDisplayArray
}

module.exports = {
  fetchBatchForecast: fetchBatchForecast,
  fetchForecast: fetchForecast,
  getForecasts: getForecasts,
  getForecastById: getForecastById,
  getAggregatedForecast: getAggregatedForecast,
  getDataEnd: getDataEnd,
  getDataStart: getDataStart,
  getForecastForFarm: getForecastForFarm,
  getForecastForTime: getForecastForTime,
  getMasterTimeline: getMasterTimeline,
  getAllAlerts: getAllAlerts,
}
