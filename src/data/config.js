
let maxFarms = 50,
    forecastInterval = 60,
    fakeNow = getFakeNow(),
    fakeActuals = true,
    now = getGlobalNow(),
    groupedFarmOpts = [
      {id: 'one', label: 'San Antonio', value: [37, 38, 39, 40, 41, 42, 43, 32, 33, 34, 35, 36]},
      {id: 'two', label: 'Houston', value: [16,17]},
    ],
    rampThresholds = [{
      id: 1,
      level: 'low',
      powerChange: 1,
      timeSpan: 60,
      displayColor: "yellow"
    },{
      id: 2,
      level: 'critical',
      powerChange: 2,
      timeSpan: 120,
      displayColor: "red"
    }];


function get(prop) {
  return this[prop];
}

function set(prop, val) {
  this[prop] = val;
}

function getQueryParam(paramName) {
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

/**
  * This function uses the current hour and min, but the date
  * as hard coded in. This allows us to put test data in play
  * and make it look semi-legit timewise, even when the date
  * is screwy
  */
function getFakeNow() {
  const useFakeNow = true;
  let fakeNow = new Date("2018-02-28T07:00:00Z"),
      now =     new Date(),
      n =       getQueryParam("n");

  if(useFakeNow) {
    fakeNow.setHours(now.getHours());
    fakeNow.setMinutes(now.getMinutes());
    fakeNow = fakeNow.getTime();
    n = (n !== null) ? parseInt(n, 10) : 0;
    fakeNow += 1000*60*60*n;
  } else {
    fakeNow = false;
  }
  return fakeNow;
}

// Super hacky just for demoing
function getGlobalNow() {
  let ts = Date.now();
  if(fakeNow){
    ts = fakeNow;
  }
  return ts;
}

module.exports = {
  get: get,
  set: set,
  maxFarms: maxFarms,
  forecastInterval: forecastInterval,
  now: now,
  getQueryParam: getQueryParam,
  groupedFarmOpts: groupedFarmOpts,
  fakeActuals: fakeActuals,
  rampThresholds: rampThresholds
}
