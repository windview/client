//app/index.js

import * as actions from './actions';
import * as actionTypes from './actionTypes';
import App from './App';
import * as constants from './constants';
import reducer from './reducer';
import * as selectors from './selectors';

//export default { actions, components, constants, reducer, selectors };
export default {
  actions,
  actionTypes,
  component: App,
  constants,
  reducer,
  selectors
};
