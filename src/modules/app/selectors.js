// app/selectors

import {
  fetchForecast
} from '../../actionCreators';


export const mapStateToProps = (state, ownProps) => {
  return {
    activePane: state.nav.activePane,
    selectedFeature: state.analysis.selectedFeature
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    fetchForecasts: (windFarms) => {
      dispatch(fetchForecast(windFarms));
    }
  }
}
