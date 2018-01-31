import API from './api';


let windFarms = []

let getWindFarmById = (fid) => {
  return windFarms.find((farm)=>{ return farm.properties.id === fid; });
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
          let farm = response.json();
          windFarms.push(farm)
          return farm;
        } else {
          throw("Error fetching farm:", farmId);
        }
      }
    )
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
            resolve({
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
          let farms = response.json();
          windFarms.push(farms)
          return farms;
        } else {
          throw("Error fetching all farms");
        }
      }
    )
}


module.exports = {
  windFarms: windFarms,
  getWindFarmById: getWindFarmById,
  fetchFarm: fetchFarm,
  fetchBatchFarms: fetchBatchFarms,
  fetchAllFarms: fetchAllFarms
}
