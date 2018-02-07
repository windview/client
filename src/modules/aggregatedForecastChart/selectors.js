// aggregatedForecastChart/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    forecastLoaded: state.data.forecastLoaded,
    selectedTimestamp: state.analysis.selectedTimestamp,
    visibleFarmIds: state.analysis.visibleFarmIds,
    selectedFarmIdsByPolygon: state.analysis.selectedFarmIdsByPolygon,
    selectedFarmIdsByGroup: state.analysis.selectedFarmIdsByGroup,
    aggregatedSource: state.analysis.dataSource,
    chartTitle: state.analysis.chartTitle
  }
}
