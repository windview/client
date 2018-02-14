
let apiBaseUrl = (() => {
  let c = process.env.API_URL,
      r;
  // if(c === "//") {
  //   r = window.location.href.split('?')[0] + '/data';
  // } else {
  if (c === '/') {
    r = 'http://localhost:4000/api'
  } else {
  ///TODO remove these lines and uncomment lines 5-7, only doing this to run server locally
    r = c;
  }
  return r;
})();

let normalizeUrl = (endpoint, params) => {
  let path = endpoint.replace(/^\//, '').replace(/\/$/, ''), // strip leading and trailing slash if present
      url = new URL(`${apiBaseUrl}/${path}`);
  if(params != null) Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return url;
}

// returns a promise which will resolve when the fetch returns
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
let goFetch = (endpoint, fetchOpts, params) => {
  const url = normalizeUrl(endpoint, params);
  return fetch(url, fetchOpts);
}

module.exports = {
  normalizeUrl: normalizeUrl,
  goFetch: goFetch
}
