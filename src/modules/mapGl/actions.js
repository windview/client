//map/actions.js

import * as t from './actionTypes';

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