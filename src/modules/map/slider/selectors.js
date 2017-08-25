// map/slider/selectors.js

export const mapStateToProps = (state, ownProps) => {
  return {
    selectedTimestamp: state.analysis.selectedTimestamp,
    timezoom: state.analysis.timezoom,
    windFarms: state.data.windFarms,
    forecast: state.data.forecast
  }
}
