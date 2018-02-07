
let maxFarms = 50,
    forecastInterval = 60,
    fakeNow = new Date("2018-02-28T07:00:00Z").getTime(),
    groupedFarmOpts = [
      {id: 'one', label: 'San Antonio', value: [37, 38, 39, 40, 41, 42, 43, 32, 33, 34, 35, 36]},
      {id: 'two', label: 'Houston', value: [16,17]},
    ];


function get(prop) {
  return this[prop];
}

let getQueryParam = (paramName) => {
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

// Super hacky just for demoing
function setGlobalFakeNow() {
  let n = getQueryParam("n");
  n = (n !== null) ? parseInt(n, 10) : 0;
  this.fakeNow += 1000*60*60*n;
}

module.exports = {
  get: get,
  maxFarms: maxFarms,
  forecastInterval: forecastInterval,
  fakeNow: fakeNow,
  getQueryParam: getQueryParam,
  groupedFarmOpts: groupedFarmOpts,
  setGlobalFakeNow: setGlobalFakeNow
}
