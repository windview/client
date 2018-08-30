// map/selectors

import {
  setAlertDisplay,
  updateSettingsTS
} from '../../actionCreators';

export const mapStateToProps = (state, ownProps) => {
  return {
    rampThresholds: state.analysis.rampThresholds,
    forecastHorizon: state.analysis.forecastHorizon,
    aggregationGroups: state.analysis.aggregationGroups,
    activePane: state.nav.activePane,
    settingsTimestamp: state.data.settingsTimestamp
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onAlertDisplay: (alertArray) => {
      dispatch(setAlertDisplay(alertArray));
    },
    onUpdateSettingsTS: (timestamp) => {
      dispatch(updateSettingsTS(timestamp));
    }
  }
}
