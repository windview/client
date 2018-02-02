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
  timezoom: 24,
  dataSource: 'visibleFarms',
  chartTitle: 'Currently Visible Wind Farms',
  multiChartMap: [],
  visibleWindFarms: [],
  selectedWindFarmsByPolygon: [],
  selectedWindFarmsByGroup: []
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// The reducers
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default (state=defaultValue, action) => {
  switch(action.type) {
    case t.MAP_MOVE:
      return {
        ...state,
        visibleWindFarms: action.features.map(f=>{return f.id;})
      };
    case t.SELECT_AGGREGATION:
      return {
        ...state,
        dataSource: action.dataSource,
        chartTitle: action.title
      };
    case t.SELECT_FEATURE:
      return {
        ...state,
        selectedFeature: action.feature.id
      };
    case t.SELECT_FEATURES_BY_GROUP:
      return {
        ...state,
        selectedWindFarmsByGroup: action.feature
      };
    case t.SELECT_FEATURES_BY_POLYGON:
      return {
        ...state,
        selectedWindFarmsByPolygon: action.feature
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
    case t.ADD_MULTI_CHART:
      if(state.multiChartMap.indexOf(action.selectedFeature.id) === -1) {
        state.multiChartMap.push(action.selectedFeature.id);
      }
      return {
        ...state
      };
    case t.REMOVE_MULTI_CHART:
      const i = state.multiChartMap.indexOf(action.fid);
      if(i !== -1) {
        state.multiChartMap.splice(i, 1)
      }
      return {
        ...state
      };
    default:
      return state;
  }
}
