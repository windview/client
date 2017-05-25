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
  switch(action.type) {
    case t.LOAD_WIND_FARM_DATA:
      return {
        ...state,
        windFarmData: action.data
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
