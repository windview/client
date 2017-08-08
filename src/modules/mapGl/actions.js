//map/actions.js

import * as t from './actionTypes';
import Store from '../../data/store';
import fetch from 'isomorphic-fetch';

// redux action creators
// http://redux.js.org/docs/basics/Actions.html
export const loadWindFarmData = (data) => ({
  type: t.LOAD_WIND_FARM_DATA,
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

export const zoom = (bbox) => ({
  type: t.ZOOM,
  bbox: {bbox}
});

// it's a thunk a la http://redux.js.org/docs/advanced/AsyncActions.html#async-action-creators
export const fetchWindFarmData = () => {
  return function(dispatch) {
    // should notify app that data is loading
    //dispatch(requestWindFarms());

    // go ahead and return a promise in case anyone upstream is interested
    return fetch(`${window.location.href}/data/usgs_wind_farms.geo.json`)
      .then(
        response => response.json(),
        error => {
          // should dispatch something to warn the user
          // dispatch(noWindFarms(error));
          console.log("Error fetching wind farm data", error);
        }
      )
      .then(
        json => {
          // post processing of the data
          Store.getBatchForecast(json.features, null, () => {
            dispatch(loadWindFarmData(json));
          });
        }
      )
  }
}
