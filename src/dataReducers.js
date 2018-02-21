// dataReducers.js

import * as t from './actionTypes';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Defaults
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// data defaults
const defaultValue = {
  windFarmsLoaded: null,
  windFarmsLoading: false,
  windFarmsLoadingError: null,
  forecastLoaded: null,
  forecastLoading: false,
  forecastLoadingError: null,
  settingsTimestamp: new Date().getTime()
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// The reducers
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


export default (state=defaultValue, action) => {
  switch(action.type) {
    case t.FETCH_FORECAST_FAIL:
      return {
        ...state,
        forecastLoading: false,
        forecastLoadingError: action.error
      };
    case t.FETCH_FORECAST_REQUEST:
      return {
        ...state,
        forecastLoading: true
      };
    case t.FETCH_FORECAST_SUCCESS:
      return {
        ...state,
        forecastLoading: false,
        forecastLoaded: true
      };
    case t.FETCH_WIND_FARMS_FAIL:
      return {
        ...state,
        windFarmsLoading: false,
        windFarmsLoadingError: action.error
      };
    case t.FETCH_WIND_FARMS_REQUEST:
      return {
        ...state,
        windFarmsLoading: true
      };
    case t.FETCH_WIND_FARMS_SUCCESS:
      return {
        ...state,
        windFarmsLoading: false,
        windFarmsLoaded: true
      };
    case t.UPDATE_SETTINGS_TS:
      return {
        ...state,
        settingsTimestamp: action.timestamp
      }
    default:
      return state;
  }
}
