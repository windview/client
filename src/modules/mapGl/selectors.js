// map/selectors.js

import * as actions from './actions';

export const mapStateToProps = (state, ownProps) => {
  return {
    feature: state.map.selectedFeature,
    selectedStyle: state.map.selectedStyle,
    selectedTimestamp: state.map.selectedTimestamp,
    windFarmData: state.map.windFarmData
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onLoadWindFarmData: (data) => {
      dispatch(actions.loadWindFarmData(data));
    },
    onSelectFeature: (feature) => {
      dispatch(actions.selectFeature(feature));
    },
    onSelectTimestamp: (timestamp) => {
      dispatch(actions.selectTimestamp(timestamp));
    },
    onSelectStyle: (style) => {
      dispatch(actions.selectStyle(style));
    }
  }
}
