// analysisReducers.js

import * as t from './actionTypes';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Defaults
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
// analysis defaults
const defaultValue = {
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
    case t.ACKNOWLEDGE_ALERT:
     return {
      ...state,
     };
    case t.MAP_MOVE:
      return {
        ...state,
        visibleWindFarms: action.features
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
