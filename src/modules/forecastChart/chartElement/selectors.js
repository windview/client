// forecastChart/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    feature: state.map.selectedFeature,
    selectedTimestamp: state.map.selectedTimestamp
  }
}
