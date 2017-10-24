// app/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    activePane: state.nav.activePane,
    selectedFeature: state.analysis.selectedFeature
  }
}
