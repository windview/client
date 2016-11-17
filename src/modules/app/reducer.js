// redux reducers 
// http://redux.js.org/docs/basics/Reducers.html

import * as t from './actionTypes';

export default (state={activePane: "map-view"}, action) => {
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
