// redux action creators 
// http://redux.js.org/docs/basics/Actions.html

import * as t from './actionTypes';

export const activateView = (viewName) => {
  return {
    type: t.ACTIVATE_VIEW,
    viewName: viewName
  }
}
