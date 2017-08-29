// forecastChart/chartElement/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    feature: state.analysis.selectedFeature,
    forecast: state.data.forecast,
    selectedTimestamp: state.analysis.selectedTimestamp
  }
}
