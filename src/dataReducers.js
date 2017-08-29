// dataReducers.js

import * as t from './actionTypes';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Defaults
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// data defaults
const defaultValue = {
  windFarms: null,
  windFarmsLoading: false,
  windFarmsLoadingError: null,
  forecast: null,
  forecastLoading: false,
  forecastLoadingError: null
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
        forecast: action.data,
        forecastMeta: action.meta
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
        windFarms: action.data
      };
    default:
      return state;
  }
}
