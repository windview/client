// analysisReducers.js

import * as t from './actionTypes';
import {now} from './data/config';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Defaults
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// TODO load some of this from configuration
// analysis defaults
const defaultValue = {
  alertArray: [],
  selectedFeature: null,
  selectedTimestamp: now,
  selectedStyle: 'ramp',
  timezoom: 24,
  dataSource: 'visibleFarms',
  multiChartMap: [],
  visibleFarmIds: [],
  selectedFarmIdsByPolygon: [],
  selectedFarmIdsByGroup: [],
  aggregationGroups: [],
  rampThresholds: [],
  forecastHorizon: 24,
  highlightedFeatureId: null
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helpers
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
  * Add or remove a single primitive value from an
  * array of primitives maintaining function purity
  */
const addToArray = (arr, item) => {
  let nu = [];
  nu.push(...arr);
  if(nu.indexOf(item) === -1) {
    nu.push(item);
  }
  return nu;
}
const removeFromArray = (arr, item) => {
  let nu = [];
  nu.push(...arr);
  const i = nu.indexOf(item);
  if(i !== -1) {
    nu.splice(i, 1);
  }
  return nu;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// The reducers
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default (state=defaultValue, action) => {
  switch(action.type) {
    case t.SET_ALERT_DISPLAY:
      return {
        ...state,
        alertArray: action.alertArray
      };
    case t.ADD_ALERT:
      return {
        ...state,
        alertArray: addToArray(state.alertArray, action.farmId)
      };
    case t.REMOVE_ALERT:
      return {
        ...state,
        alertArray: removeFromArray(state.alertArray, action.farmId)
      };
    case t.ADD_AGGREGATION_GROUP:
      return {
        ...state,
        aggregationGroups: addToArray(state.aggregationGroups, action.groupId)
      };
    case t.ADD_RAMP_THRESHOLD:
      return {
        ...state,
        rampThresholds: addToArray(state.rampThresholds, action.rampId)
      };
    case t.MAP_MOVE:
      return {
        ...state,
        visibleFarmIds: action.farmIds
      };
    case t.REMOVE_AGGREGATION_GROUP:
      return {
        ...state,
        aggregationGroups: removeFromArray(state.aggregationGroups, action.groupId)
      };
    case t.REMOVE_RAMP_THRESHOLD:
      return {
        ...state,
        rampThresholds: removeFromArray(state.rampThresholds, action.rampId)
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
        selectedFarmIdsByGroup: action.farmIds,
        selectedGroupLabel: action.groupLabel
      };
    case t.SELECT_FEATURES_BY_POLYGON:
      return {
        ...state,
        selectedFarmIdsByPolygon: action.farmIds
      };
    case t.SELECT_FORECAST_HORIZON:
      return {
        ...state,
        forecastHorizon: action.forecastHorizon
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
      return {
        ...state,
        multiChartMap: addToArray(state.multiChartMap, action.selectedFeatureId)
      };
    case t.REMOVE_MULTI_CHART:
      return {
        ...state,
        multiChartMap: removeFromArray(state.multiChartMap, action.selectedFeatureId)
      };
    case t.HIGHLIGHT_FEATURE:
      return {
        ...state,
        highlightedFeatureId: action.featureId
      }
    case t.UNHIGHLIGHT_FEATURE:
      return {
        ...state,
        highlightedFeatureId: null
      }
    default:
      return state;
  }
}
