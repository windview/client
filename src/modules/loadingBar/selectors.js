
export const mapStateToProps = (state, ownProps) => {
  return {
    windFarmsLoading: state.data.windFarmsLoading,
    forecastLoading: state.data.forecastLoading,
  }
}
