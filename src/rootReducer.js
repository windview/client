import { combineReducers } from 'redux';
import app from './modules/app/index';
import map from './modules/map/index';

export default combineReducers({
  [app.constants.NAME]: app.reducer,
  [map.constants.NAME]: map.reducer
});
