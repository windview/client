// forecastChart/chartElement/selectors

import {addMultiChart, removeMultiChart} from '../../../actionCreators';

export const mapStateToProps = (state, ownProps) => {
  return {
    selectedFarmId: state.analysis.selectedFeature,
    selectedTimestamp: state.analysis.selectedTimestamp,
    multiChartMap: state.analysis.multiChartMap,
    chartType: state.nav.botChartType,
    alertArray: state.analysis.alertArray,
    settingsTimestamp: state.data.settingsTimestamp,
    forecastTimestamp: state.data.forecastTimestamp
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onAddMultiChart: (selectedFeatureId) => {
      dispatch(addMultiChart(selectedFeatureId));
    },
    onRemoveMultiChart: (selectedFeatureId) => {
      dispatch(removeMultiChart(selectedFeatureId));
    }
  }
}