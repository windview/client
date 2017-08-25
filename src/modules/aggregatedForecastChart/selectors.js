
export const mapStateToProps = (state, ownProps) => {
  return {
    forecast: state.data.forecast
  }
}
