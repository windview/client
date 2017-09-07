// forecastMeta/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    selectedFeature: state.analysis.selectedFeature,
    forecast: state.data.forecast
  }
}
