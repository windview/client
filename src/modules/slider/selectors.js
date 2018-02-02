// slider/selectors

import * as actions from '../../actionCreators';

export const mapStateToProps = (state, ownProps) => {
  return {
    selectedTimestamp: state.analysis.selectedTimestamp,
    timezoom: state.analysis.timezoom,
    forecastLoaded: state.data.forecastLoaded
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onSelectTimestamp: (timestamp) => {
      dispatch(actions.selectTimestamp(timestamp));
    }
  }
}
