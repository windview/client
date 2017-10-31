import * as actions from '../../actionCreators';

// farmDetail/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    feature: state.analysis.selectedFeature,
    selectedTimestamp: state.analysis.selectedTimestamp
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    onAcknowledgeAlert: (feature) => {
      dispatch(actions.acknowledgeAlert(feature));
    },
  };
};
