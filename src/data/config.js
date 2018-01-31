
let maxFarms = 25;
let forecastInterval = 60;
let fakeNow = new Date("2012-12-08T07:00:00Z").getTime();

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

// Super hacky just for the demo on May 5, 2017
let setGlobalFakeNow = () => {
  let n = getQueryParam("n"),
      now = 0;
  switch(n) {
    case '1':
      now = 1492192800000;
      break;
    case '2':
      now = 1492209000000;
      break;
    case '3':
      now = 1492219800000;
      break;
    default:
      // This is in the middle of the Texas data Andy provided
      now = fakeNow
  }

  window.fakeNow = now;
}

module.exports = {
  maxFarms: maxFarms,
  forecastInterval: forecastInterval,
  fakeNow: fakeNow,
  setGlobalFakeNow: setGlobalFakeNow
}
