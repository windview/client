// forecastChart/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    selectedFarmId: state.analysis.selectedFeature,
    forecast: state.data.forecast
  }
}
