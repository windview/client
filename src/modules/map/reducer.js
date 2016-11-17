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
  selectedFeature: null,
  selectedTimestamp: getStartTime(),
}

export default (state=defaultValue, action) => {
  switch(action.type) {
    case t.SELECT_FEATURE:
      return {
        selectedFeature: action.feature
      };
    case t.SELECT_TIME:
      return {
        selectedTimestamp: action.timestamp
      }
    default:
      return state;
  }
}
