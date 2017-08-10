// actionCreators.js

// redux action creators
// http://redux.js.org/docs/basics/Actions.html

import * as t from './actionTypes';
import Store from '../../data/store';
import fetch from 'isomorphic-fetch';


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// POJO action creators
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const activateView = (viewName) => {
  return {
    type: t.ACTIVATE_VIEW,
    viewName: viewName
  }
}

export const fetchForecastFail = (error) => ({
  type: t.FETCH_FORECAST_FAIL,
  error: error
});

export const fetchForecastRequest = () => ({
  type: t.FETCH_FORECAST_REQUEST
});

export const fetchForecastSuccess = (data) => ({
  type: t.FETCH_FORECAST_SUCCESS,
  data: data
});

export const fetchWindFarmsFail = (error) => ({
  type: t.FETCH_WIND_FARMS_FAIL,
  error: error
});

export const fetchWindFarmsRequest = () => ({
  type: t.FETCH_WIND_FARMS_REQUEST
});

export const fetchWindFarmsSuccess = (data) => ({
  type: t.FETCH_WIND_FARMS_SUCCESS,
  data: data
});

export const selectFeature = (feature) => ({
  type: t.SELECT_FEATURE,
  feature: feature
});

export const selectStyle = (style) => ({
  type: t.SELECT_STYLE,
  style: style
});

export const selectTimestamp = (timestamp) => ({
    type: t.SELECT_TIME,
    timestamp: timestamp
});

export const selectTimezoom = (timezoom) => ({
  type: t.SELECT_TIME_ZOOM,
  timezoom: timezoom
});


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// thunk action creators for async actions a la
// http://redux.js.org/docs/advanced/AsyncActions.html#async-action-creators
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const fetchForecast = () => {
  return function(dispatch) {
    // notify the app that data is loading
    dispatch(fetchForecastRequest());

    return fetch('http://nrel.gov')
      .then(
        response => response.json(),
        error => {
          // notify the system of the fetch error
          dispatch(fetchForecastFail(error));
        }
      )
      .then(
        json => {
          dispatch(fetchForecastSuccess(json));
        }
      )
  }
}

export const fetchWindFarms = () => {
  return function(dispatch) {
    // notify app that data is loading
    dispatch(fetchWindFarmsRequest());

    // go ahead and return a promise in case anyone upstream is interested
    return fetch(`${Store.apiBaseUrl}/usgs_wind_farms.geo.json`)
      .then(
        response => response.json(),
        error => {
          // notify the system of the fetch error
          dispatch(fetchWindFarmsFail(error));
        }
      )
      .then(
        json => {
          // post processing of the data
          Store.getBatchForecast(json.features, 24, () => {
            dispatch(fetchWindFarmsSuccess(json));
          }, this);
        }
      )
  }
}
