// slider/selectors

import * as actions from '../../actionCreators';

export const mapStateToProps = (state, ownProps) => {
  return {
    selectedTimestamp: state.analysis.selectedTimestamp,
    timezoom: state.analysis.timezoom,
    windFarms: state.data.windFarms,
    forecast: state.data.forecast
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onSelectTimestamp: (timestamp) => {
      dispatch(actions.selectTimestamp(timestamp));
    }
  }
}
