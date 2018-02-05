import API from './api';
import CONFIG from './config';
import Forecast from './forecast';


let windFarms = [];

// FIXME for debugging only
window.FARMS = ()=>windFarms;

let getFarms = ()=>windFarms;

let getWindFarmById = (fid) => {
  return windFarms.find((farm)=>{ return farm.id === fid; });
}

/**
  * Loads a farm from the server by id
  *
  * @return a fetch promise that will fulfill with the farm when it is loaded
  */
let fetchFarm = (farmId) => {
  return API.goFetch(`/farms/${farmId}`)
    .then(
      response => {
        if(response.ok) {
          return response.json();
        } else {
          throw("Error fetching farm:", farmId);
        }
      }
    )
    .then(json => {
      windFarms.push(json);
      return json;
    })
}

/**
  * Loads an array of farms matching the given array of ids.
  *
  * If the fetch job encounters errors this method keeps chugging through the
  * list. Checking for fetch errors across all farms is not done here!
  *
  * @return a JS Promise that will fulfill when all farms are fetch-resolved
  * with an object whose data node is the array of farms
  */
let fetchBatchFarms = (windFarmIds) => {
  let queueCount = windFarmIds.length,
      _self = this;

  return new Promise((resolve, reject) => {
    windFarmIds.forEach((farmId) => {
      fetchFarm(farmId)
        .catch(error => {
          console.log(error);
        })
        .then(() => {
          if(--queueCount === 0) {
            resolve ({
              data: windFarms,
            });
          }
        })
    });
  });
}

/**
  * Loads all of the farms in the DB from the server
  *
  * @return a fetch promise that will fulfill with the array of
  * farms when they are all loaded
  */
let fetchAllFarms = () => {
  return API.goFetch(`/farms`)
    .then(
      response => {
        if(response.ok) {
          return response.json()
        } else {
          throw new Error("Error fetching all farms");
        }
      }
    )
    .then(json => {
      const maxFarms = CONFIG.maxFarms || 250;
      let farms = json.farms
      if(farms.length > maxFarms) {
        farms = farms.slice(0, maxFarms);
      }
      windFarms = windFarms.concat(farms);
      return {
        data: farms
      };
    });
}

/**
  * Properties used by the map for styling include
  * - id
  * - bestForecastMW
  * - prob1stQuantForecastMW
  * - prob25thQuantForecastMW
  * - prob75thQuantForecastMW
  * - prob99thQuantForecastMW
  * - capacity_mw
  * - maxRampSeverity
  * - rampSeverity
  */
let getGeoJsonForFarms = (selectedTimestamp) => {
  // TODO could tighten this up by only using properties necessary for
  // MapBox to have in the GeoJSON result
  let json = {
    "type": "FeatureCollection",
    "features": windFarms.map((farm) => {
      let forecast = Forecast.getForecastForFarm(farm.id),
          forecastProps = {},
          forecastForTime,
          farmProps = {
            fid: farm.id,
            capacity_mw: farm.capacity_mw,
            label: farm.name
          }

      if(forecast) {
        forecastProps.maxRampSeverity = forecast.alerts.maxRampSeverity;
        forecastForTime = Forecast.getForecastForTime(selectedTimestamp, forecast);
        if(forecastForTime) {
          Object.assign(forecastProps, {
            bestForecastMW: forecastForTime.bestForecastMW,
            prob1stQuantForecastMW: forecastForTime.prob1stQuantForecastMW,
            prob25thQuantForecastMW: forecastForTime.prob25thQuantForecastMW,
            prob75thQuantForecastMW: forecastForTime.prob75thQuantForecastMW,
            prob99thQuantForecastMW: forecastForTime.prob99thQuantForecastMW,
            rampSeverity: forecastForTime.rampSeverity,
            maxRampSeverity: forecast.alerts.maxRampSeverity
          });
        }
      }

      return {
        "type": "Feature",
        "geometry": { "type": "Point", "coordinates": [ farm.longitude, farm.latitude ] },
        "properties": Object.assign({}, farmProps, forecastProps)
      }
    })
  };
  return json;
}

let setSelectedFarm = (farm) => {
  windFarms.forEach(f=>{f.selected = false});
  farm.selected = true;
}


module.exports = {
  getFarms: getFarms,
  windFarms: windFarms,
  getWindFarmById: getWindFarmById,
  fetchFarm: fetchFarm,
  fetchBatchFarms: fetchBatchFarms,
  fetchAllFarms: fetchAllFarms,
  getGeoJsonForFarms: getGeoJsonForFarms,
  setSelectedFarm: setSelectedFarm
}
