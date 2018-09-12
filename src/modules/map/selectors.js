// map/selectors

import * as actions from '../../actionCreators';

export const mapStateToProps = (state, ownProps) => {
  return {
    alertArray: state.analysis.alertArray,
    highlightedFeatureId: state.analysis.highlightedFeatureId,
    selectedFarmId: state.analysis.selectedFeature,
    selectedStyle: state.analysis.selectedStyle,
    selectedTimestamp: state.analysis.selectedTimestamp,
    timezoom: state.analysis.timezoom,
    windFarmsLoaded: state.data.windFarmsLoaded,
    windFarmsLoading: state.data.windFarmsLoading,
    windFarmsLoadingError: state.data.windFarmsLoadingError,
    forecastLoaded: state.data.forecastLoaded,
    forecastLoading: state.data.forecastLoading,
    forecastLoadingError: state.data.forecastLoadingError,
    forecastTimestamp: state.data.forecastTimestamp,
    settingsTimestamp: state.data.settingsTimestamp,
    highlightAggSet: state.nav.highlightAggSet,
    visibleFarmIds: state.analysis.visibleFarmIds,
    selectedFarmIdsByPolygon: state.analysis.selectedFarmIdsByPolygon,
    selectedFarmIdsByGroup: state.analysis.selectedFarmIdsByGroup,
    aggregatedSource: state.analysis.dataSource,
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onComponentDidMount: () => {
      dispatch(actions.fetchWindFarms());
    },
    onBumpForecast: (data) => {
      dispatch(actions.fetchForecastSuccess());
    },
    onMapMove: (features) => {
      dispatch(actions.mapMove(features));
    },
    onSelectFeature: (feature) => {
      dispatch(actions.selectFeature(feature));
    },
    onSelectFeaturesByPolygon: (feature) => {
      dispatch(actions.selectFeaturesByPolygon(feature));
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
