import * as actions from '../../actionCreators';

// farmDetail/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    selectedFarmId: state.analysis.selectedFeature,
    selectedTimestamp: state.analysis.selectedTimestamp,
    displayAlerts: state.analysis.selectedFarmDisplayAlerts
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    // FIXME figure out what we really want to do with these events
    onToggleAlert: (displayAlert) => {
      dispatch(actions.setAlertDisplay(displayAlert));
    },
  };
};
