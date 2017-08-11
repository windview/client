

let Config = new function() {

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
  
  this.getQueryParam = (paramName) => {
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
  this.setGlobalFakeNow = () => {
    let n = this.getQueryParam("n"),
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
        now = 1492168500000;
    }
    window.fakeNow = now;
  }
}();

export default Config;
