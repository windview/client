// reducers.js

// redux reducers
// http://redux.js.org/docs/basics/Reducers.html

import * as t from './actionTypes';


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Some helper functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// The current time rounded down to the closest 5 minute
// interval in the past
const getStartTime = () => {
  let startTime = new Date();
  let minute = startTime.getMinutes();
  let remainder = minute%5;
  minute -= remainder;
  startTime.setMinutes(minute);
  return startTime.getTime();
}

// TODO load some of this from configuration
// app defaults
const defaultValue = {
  activePane: "map-view",
  windFarms: null,
  windFarmsLoading: false,
  windFarmsLoadingError: null,
  selectedFeature: null,
  selectedTimestamp: getStartTime(),
  selectedStyle: 'ramp',
  timezoom: 24
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// The reducers
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default (state=defaultValue, action) => {
  switch(action.type) {
    case t.ACTIVATE_VIEW:
      return {
        ...state,
        activePane: action.viewName
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
    case t.SELECT_FEATURE:
      return {
        ...state,
        selectedFeature: action.feature
      };
    case t.SELECT_STYLE:
      return {
        ...state,
        selectedStyle: action.style
      };
    case t.SELECT_TIME:
      return {
        ...state,
        selectedTimestamp: action.timestamp
      };
    case t.SELECT_TIME_ZOOM:
      return {
        ...state,
        timezoom: action.timezoom
      };
    default:
      return state;
  }
}
