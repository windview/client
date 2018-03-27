
let maxFarms = 50,
    farmIds = [16, 17, 18, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 34, 35, 39, 40, 42, 43, 45, 46, 48, 50, 51, 52, 53, 56, 57, 58, 59, 60, 62, 63, 64, 65, 67, 68, 69, 71, 72, 83, 84, 86, 87, 88, 89, 90, 91, 92, 94, 95, 96, 106, 111, 115, 116, 117, 118, 119, 121, 125, 126, 127, 132, 134, 142, 156, 157, 158, 159, 164, 165, 166, 171, 172, 173, 174, 176, 177, 179, 180, 181, 183, 185, 186, 187, 188, 204, 208, 209, 216, 217, 218, 220, 223, 225, 227, 229],
    forecastType = "probabilistic",
    //farmIds = [230],
    //forecastType = "point",
    forecastInterval = 60,
    forecastHorizon = 1,
    fakeNow = getFakeNow(),
    fakeActuals = true,
    now = getGlobalNow(),
    groupedFarmOpts = [{
      id: 'one',
      label: 'San Antonio',
      value: [37, 38, 39, 40, 41, 42, 43, 32, 33, 34, 35, 36]
    },{
      id: 'two',
      label: 'Houston',
      value: [16,17]
    }],
    rampThresholds = [{
      level: 1,
      powerChange: 2,
      timeSpan: 60,
      color: "yellow"
    },{
      level: 2,
      powerChange: 3,
      timeSpan: 120,
      color: "orange"
    },{
      level: 3,
      powerChange: 4,
      timeSpan: 180,
      color: "red"
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
  let fakeNow = new Date("2018-02-28T06:00:00Z"),
      //now =     new Date(),
      n =       getQueryParam("n");

  if(useFakeNow) {
    //fakeNow.setHours(now.getHours());
    //fakeNow.setMinutes(now.getMinutes());
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
  farmIds: farmIds,
  maxFarms: maxFarms,
  forecastInterval: forecastInterval,
  forecastHorizon: forecastHorizon,
  forecastType: forecastType,
  now: now,
  getQueryParam: getQueryParam,
  groupedFarmOpts: groupedFarmOpts,
  fakeActuals: fakeActuals,
  rampThresholds: rampThresholds
}
