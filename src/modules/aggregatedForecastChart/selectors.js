// aggregatedForecastChart/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    forecast: state.data.forecast,
    selectedTimestamp: state.analysis.selectedTimestamp,
    visibleWindFarms: state.analysis.visibleWindFarms,
    selectedWindFarmsByPolygon: state.analysis.selectedWindFarmsByPolygon,
    aggregatedSource: state.analysis.dataSource
  }
}
