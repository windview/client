// app/selectors

export const mapStateToProps = (state, ownProps) => {
  return {
    activePane: state.nav.activePane
  }
}
