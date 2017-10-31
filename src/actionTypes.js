// actionTypes.js

// redux actions each use a static type key.
// http://redux.js.org/docs/basics/Actions.html

// navigation actions
export const ACTIVATE_VIEW = 'ACTIVATE_VIEW'

// async data request related actions
export const FETCH_FORECAST_FAIL = 'FETCH_FORECAST_FAIL';
export const FETCH_FORECAST_REQUEST = 'FETCH_FORECAST_REQUEST';
export const FETCH_FORECAST_SUCCESS = 'FETCH_FORECAST_SUCCESS';
export const FETCH_WIND_FARMS_FAIL = 'FETCH_WIND_FARMS_FAIL';
export const FETCH_WIND_FARMS_REQUEST = 'FETCH_WIND_FARMS_REQUEST';
export const FETCH_WIND_FARMS_SUCCESS = 'FETCH_WIND_FARMS_SUCCESS';

// analysis actions
export const ACKNOWLEDGE_ALERT = 'ACKNOWLEDGE_ALERT';
export const MAP_MOVE = 'MAP_MOVE';
export const SELECT_FEATURE = 'SELECT_FEATURE';
export const SELECT_STYLE = 'SELECT_STYLE';
export const SELECT_TIME = 'SELECT_TIME';
export const SELECT_TIME_ZOOM = 'SELECT_TIME_ZOOM';
