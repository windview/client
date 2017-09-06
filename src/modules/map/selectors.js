// map/selectors

import * as actions from '../../actionCreators';

export const mapStateToProps = (state, ownProps) => {
  return {
    feature: state.analysis.selectedFeature,
    selectedStyle: state.analysis.selectedStyle,
    selectedTimestamp: state.analysis.selectedTimestamp,
    timezoom: state.analysis.timezoom,
    windFarms: state.data.windFarms,
    windFarmsLoading: state.data.windFarmsLoading,
    windFarmsLoadingError: state.data.windFarmsLoadingError,
    forecast: state.data.forecast,
    forecastLoading: state.data.forecastLoading,
    forecastLoadingError: state.data.forecastLoadingError
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onComponentDidMount: () => {
      dispatch(actions.fetchWindFarms());
    },
    onBumpForecast: (data) => {
      dispatch(actions.fetchForecastSuccess(data));
    },
    onMapMove: (features) => {
      dispatch(actions.mapMove(features));
    },
    onSelectFeature: (feature) => {
      dispatch(actions.selectFeature(feature));
    },
    onSelectStyle: (style) => {
      dispatch(actions.selectStyle(style));
    },
    onSelectTimestamp: (timestamp) => {
      dispatch(actions.selectTimestamp(timestamp));
    },
    onSelectTimezoom: (timezoom) => {
      dispatch(actions.selectTimezoom(timezoom));
    }
  }
}
