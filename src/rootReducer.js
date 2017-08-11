import { combineReducers } from 'redux';
import nav from './navigationReducers';
import data from './dataReducers';
import analysis from './analysisReducers';

export default combineReducers({
  nav,
  data,
  analysis
});
