// map/reducer.js

// redux reducers
// http://redux.js.org/docs/basics/Reducers.html

import * as t from './actionTypes';

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

const defaultValue = {
  windFarmData: null,
  selectedFeature: null,
  selectedTimestamp: getStartTime(),
  selectedStyle: 'ramp',
  timezoom: 24
}

export default (state=defaultValue, action) => {
  let newState = null;
  switch(action.type) {
    case t.LOAD_WIND_FARM_DATA:
      newState = {
        ...state,
        windFarmData: action.data
      };
      break;
    case t.SELECT_FEATURE:
      newState = {
        ...state,
        selectedFeature: action.feature
      };
      break;
    case t.SELECT_STYLE:
      newState = {
        ...state,
        selectedStyle: action.style
      };
      break;
    case t.SELECT_TIME:
      newState = {
        ...state,
        selectedTimestamp: action.timestamp
      };
      break;
    case t.SELECT_TIME_ZOOM:
      newState = {
        ...state,
        timezoom: action.timezoom
      };
      break;
    default:
      newState = state;
  }
  return newState;
}
