// forecastChart/chartElement/selectors

import * as actions from '../../../actionCreators';

export const mapStateToProps = (state, ownProps) => {
  return {
    feature: state.analysis.selectedFeature,
    forecast: state.data.forecast,
    selectedTimestamp: state.analysis.selectedTimestamp,
    analysis: state.analysis
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onAddMultiChart: (selectedFeature) => {
      dispatch(actions.addMultiChart(selectedFeature));
    },
    onRemoveMultiChart: (label) => {
      dispatch(actions.removeMultiChart(label));
    }
  }
}