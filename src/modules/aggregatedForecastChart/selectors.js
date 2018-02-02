// aggregatedForecastChart/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    forecastLoaded: state.data.forecastLoaded,
    selectedTimestamp: state.analysis.selectedTimestamp,
    visibleWindFarms: state.analysis.visibleWindFarms,
    selectedWindFarmsByPolygon: state.analysis.selectedWindFarmsByPolygon,
    selectedWindFarmsByGroup: state.analysis.selectedWindFarmsByGroup,
    aggregatedSource: state.analysis.dataSource,
    chartTitle: state.analysis.chartTitle
  }
}
