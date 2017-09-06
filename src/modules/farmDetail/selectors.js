// farmDetail/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    feature: state.analysis.selectedFeature,
    selectedTimestamp: state.analysis.selectedTimestamp
  }
}
