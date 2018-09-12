// navigationReducers.js

import * as t from './actionTypes';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Defaults
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// TODO load from config?
// navigation defaults
const defaultValue = {
  activePane: "map-view",
  botChartType: "aggregation"
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
    case t.SELECT_BOT_CHART:
      return{
        ...state,
        botChartType: action.chartType
      };
    case t.SET_AGG_HIGHLIGHT:
    return {
      ...state,
      highlightAggSet: action.lightitup
    };
    default:
      return state;
  }
}
