// multiPlot/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    multiChartMap: state.analysis.multiChartMap
  }
}
