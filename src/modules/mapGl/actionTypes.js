//map/actionTypes.js

// redux actions each use a static type key. This defines
// those for the map module
// http://redux.js.org/docs/basics/Actions.html
export const FETCH_WIND_FARMS_REQUEST = 'map/FETCH_WIND_FARMS_REQUEST';
export const FETCH_WIND_FARMS_SUCCESS = 'map/FETCH_WIND_FARMS_SUCCESS';
export const FETCH_WIND_FARMS_FAIL = 'map/FETCH_WIND_FARMS_FAIL';
export const FETCH_FORECAST_REQUEST = 'map/FETCH_FORECAST_REQUEST';
export const FETCH_FORECAST_SUCCESS = 'map/FETCH_FORECAST_SUCCESS';
export const FETCH_FORECAST_FAIL = 'map/FETCH_FORECAST_FAIL';
export const SELECT_FEATURE = 'map/SELECT_FEATURE';
export const SELECT_STYLE = 'map/SELECT_STYLE';
export const SELECT_TIME = 'map/SELECT_TIME';
export const SELECT_TIME_ZOOM = 'map/SELECT_TIME_ZOOM';
export const ZOOM = 'map/ZOOM';
