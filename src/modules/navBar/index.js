// navBar/index.js

import * as actions from './actions';
import * as actionTypes from './actionTypes';
import * as constants from './constants';
import NavBar from './NavBar';
import reducer from './reducer';
import * as selectors from './selectors';

//export default { actions, components, constants, reducer, selectors };
export default {
  actions,
  actionTypes,
  component: NavBar,
  constants,
  reducer,
  selectors
};
