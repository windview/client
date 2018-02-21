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
export const SET_ALERT_DISPLAY = 'SET_ALERT_DISPLAY';
export const ADD_ALERT = 'ADD_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';
export const MAP_MOVE = 'MAP_MOVE';
export const SELECT_AGGREGATION = 'SELECT_AGGREGATION';
export const ADD_AGGREGATION_GROUP = 'ADD_AGG_GROUP';
export const REMOVE_AGGREGATION_GROUP = 'REM_AGG_GROUP';
export const ADD_RAMP_THRESHOLD = "ADD_RAMP";
export const REMOVE_RAMP_THRESHOLD = "REM_RAMP";
export const SELECT_FEATURE = 'SELECT_FEATURE';
export const SELECT_FEATURES_BY_GROUP = 'SELECT_FEATURES_BY_GROUP';
export const SELECT_FEATURES_BY_POLYGON = 'SELECT_FEATURES_BY_POLYGON';
export const SELECT_STYLE = 'SELECT_STYLE';
export const SELECT_TIME = 'SELECT_TIME';
export const SELECT_TIME_ZOOM = 'SELECT_TIME_ZOOM';
export const SELECT_FORECAST_HORIZON = "SELECT_FORECAST_HORIZON";
export const SELECT_BOT_CHART = 'SELECT_BOT_CHART';
export const ADD_MULTI_CHART = 'ADD_MULTI_CHART';
export const REMOVE_MULTI_CHART = 'REMOVE_MULTI_CHART';
export const UPDATE_SETTINGS_TS = 'UPDATE_SETTINGS_TX';

