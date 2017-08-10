// map/selectors.js

import * as actions from './actions';

export const mapStateToProps = (state, ownProps) => {
  return {
    feature: state.map.selectedFeature,
    selectedStyle: state.map.selectedStyle,
    selectedTimestamp: state.map.selectedTimestamp,
    timezoom: state.map.timezoom,
    windFarms: state.map.windFarms,
    windFarmsLoading: state.map.windFarmsLoading,
    windFarmsLoadingError: state.map.windFarmsLoadingError
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onComponentDidMount: () => {
      dispatch(actions.fetchWindFarms());
    },
    onBumpWindFarms: (data) => {
      dispatch(actions.fetchWindFarmsSuccess(data));
    },
    onSelectFeature: (feature) => {
      dispatch(actions.selectFeature(feature));
    },
    onSelectStyle: (style) => {
      dispatch(actions.selectStyle(style));
    },
    onSelectTimestamp: (timestamp) => {
      dispatch(actions.selectTimestamp(timestamp));
    },
    onSelectTimezoom: (timezoom) => {
      dispatch(actions.selectTimezoom(timezoom));
    }
  }
}
