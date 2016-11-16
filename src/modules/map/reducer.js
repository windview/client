// map/reducer.js

// redux reducers 
// http://redux.js.org/docs/basics/Reducers.html

import * as t from './actionTypes';

const defaultValue = {
  selectedFeature: null
}

export default (state=defaultValue, action) => {
  switch(action.type) {
    case t.SELECT_FEATURE:
      return {
        selectedFeature: action.feature
      };
    default:
      return state;
  }
}
