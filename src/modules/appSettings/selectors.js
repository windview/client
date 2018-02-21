// map/selectors

import {
  addAggregationGroup,
  removeAggregationGroup,
  addRampThreshold,
  removeRampThreshold,
  selectForecastHorizon,
  setAlertDisplay,
  updateSettingsTS
} from '../../actionCreators';

export const mapStateToProps = (state, ownProps) => {
  return {
    rampThresholds: state.analysis.rampThresholds,
    forecastHorizon: state.analysis.forecastHorizon,
    aggregationGroups: state.analysis.aggregationGroups,
    activePane: state.nav.activePane
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onAddAggregationGroup: (groupId) => {
      dispatch(addAggregationGroup(groupId));
    },
    onAddRampThreshold: (rampId) => {
      dispatch(addRampThreshold(rampId));
    },
    onAlertDisplay: (alertArray) => {
      dispatch(setAlertDisplay(alertArray));
    },
    onRemoveAggregationGroup: (groupId) => {
      dispatch(removeAggregationGroup(groupId));
    },
    onRemoveRampThreshold: (rampId) => {
      dispatch(removeRampThreshold(rampId));
    },
    onSelectForecastHorizon: (forecastHorizon) => {
      dispatch(selectForecastHorizon(forecastHorizon));
    },
    onUpdateSettingsTS: (timestamp) => {
      dispatch(updateSettingsTS(timestamp));
    }
  }
}
