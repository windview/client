// forecastMeta/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    selectedFarmId: state.analysis.selectedFeature
  }
}
