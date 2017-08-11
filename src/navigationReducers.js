// navigationReducers.js

import * as t from './actionTypes';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Defaults
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// TODO load from config?
// navigation defaults
const defaultValue = {
  activePane: "map-view"
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
    default:
      return state;
  }
}