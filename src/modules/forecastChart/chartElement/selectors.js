// forecastChart/chartElement/selectors

import * as actions from '../../../actionCreators';

export const mapStateToProps = (state, ownProps) => {
  return {
    selectedFarmId: state.analysis.selectedFeature,
    selectedTimestamp: state.analysis.selectedTimestamp,
    multiChartMap: state.analysis.multiChartMap
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