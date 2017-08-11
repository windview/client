
let API = new function() {

  // this.apiBaseUrl = process.env.API_URL + "/data";
  this.apiBaseUrl = (() => {
    let c = process.env.API_URL,
        r;
    if(c === "//") {
      r = window.location.href
    } else {
      r = c;
    }
    return `${r}/data`;
  })();

  // returns a promise which will resolve when the fetch returns
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
  this.goFetch = (endpoint, fetchOpts, params) => {
    const url = this.normalizeUrl(endpoint, params);
    return fetch(url, fetchOpts);
  }

  this.normalizeUrl = (endpoint, params) => {
    let path = endpoint.replace(/^\//, '').replace(/\/$/, ''), // strip leading and trailing slash if present
        url = new URL(`${this.apiBaseUrl}/${path}`);
    if(params != null) Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return url;
  }
}();

export default API;
