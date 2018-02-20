import * as actions from '../../actionCreators';

// farmDetail/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    selectedFarmId: state.analysis.selectedFeature,
    selectedTimestamp: state.analysis.selectedTimestamp,
    alertArray: state.analysis.alertArray,
    forecastLoaded: state.data.forecastLoaded
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    // FIXME figure out what we really want to do with these events

    onAlertDisplay: (alertArray) => {
      dispatch(actions.setAlertDisplay(alertArray));
    },
    onRemoveAlert: (farmId) => {
      dispatch(actions.removeAlert(farmId));
    },
    onAddAlert: (farmId) => {
      dispatch(actions.addAlert(farmId));
    },
  };
};
