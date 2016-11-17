// map/slider/selectors.js

export const mapStateToProps = (state, ownProps) => {
  return {
    selectedTimestamp: state.map.selectedTimestamp
  }
}
