// map/selectors.js

import * as actions from './actions';

export const mapStateToProps = (state, ownProps) => {
  return {
    feature: state.map.selectedFeature,
    selectedTimestamp: state.map.selectedTimestamp
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onSelectFeature: (feature) => {
      dispatch(actions.selectFeature(feature));
    },
    onSelectTimestamp: (timestamp) => {
      dispatch(actions.selectTimestamp(timestamp));
    }
  }
}
