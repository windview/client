//map/actions.js

import * as t from './actionTypes';

// redux action creators 
// http://redux.js.org/docs/basics/Actions.html
export const selectFeature = (feature) => ({
  type: t.SELECT_FEATURE,
  feature: feature
});

export const zoom = (bbox) => ({
  type: t.ZOOM,
  bbox: {bbox}
});
