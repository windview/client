import * as actions from '../../actionCreators';

// farmDetail/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    feature: state.analysis.selectedFeature,
    forecast: state.data.forecast,
    selectedTimestamp: state.analysis.selectedTimestamp
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    onAcknowledgeAlert: (forecast, id) => {
      dispatch(actions.acknowledgeAlert(forecast, id));
    },
  };
};
