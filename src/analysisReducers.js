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
  multiChartMap: [],
  visibleFarmIds: [],
  selectedFarmIdsByPolygon: [],
  selectedFarmIdsByGroup: []
}

let newMap;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// The reducers
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default (state=defaultValue, action) => {
  switch(action.type) {
    case t.MAP_MOVE:
      return {
        ...state,
        visibleFarmIds: action.farmIds
      };
    case t.SELECT_AGGREGATION:
      return {
        ...state,
        dataSource: action.dataSource
      };
    case t.SELECT_FEATURE:
      return {
        ...state,
        selectedFeature: action.feature.id
      };
    case t.SELECT_FEATURES_BY_GROUP:
      return {
        ...state,
        selectedFarmIdsByGroup: action.farmIds
      };
    case t.SELECT_FEATURES_BY_POLYGON:
      return {
        ...state,
        selectedFarmIdsByPolygon: action.farmIds
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
      newMap = [];
      newMap.push(...state.multiChartMap);
      if(newMap.indexOf(action.selectedFeatureId) === -1) {
        newMap.push(action.selectedFeatureId);
      }
      return {
        ...state,
        multiChartMap: newMap
      };
    case t.REMOVE_MULTI_CHART:
      newMap = [];
      newMap.push(...state.multiChartMap);
      const i = newMap.indexOf(action.selectedFeatureId);
      if(i !== -1) {
        newMap.splice(i, 1);
      }
      return {
        ...state,
        multiChartMap: newMap
      };
    default:
      return state;
  }
}
