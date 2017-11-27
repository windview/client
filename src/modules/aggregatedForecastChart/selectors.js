// aggregatedForecastChart/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    forecast: state.data.forecast,
    selectedTimestamp: state.analysis.selectedTimestamp,
    visibleWindFarms: state.analysis.visibleWindFarms,
    selectedWindFarmsByPolygon: state.analysis.selectedWindFarmsByPolygon,
    selectedWindFarmsByGroup: state.analysis.groupOfWindFarms,
    aggregatedSource: state.analysis.dataSource,
    chartTitle: state.analysis.chartTitle
  }
}
