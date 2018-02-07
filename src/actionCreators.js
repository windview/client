// actionCreators.js

// redux action creators
// http://redux.js.org/docs/basics/Actions.html

import * as t from './actionTypes';
import Forecast from './data/forecast';
import WindFarm from './data/windFarm';


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// POJO action creators
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const toggleAlert = (forecast, id) => ({
  type: t.TOGGLE_ALERT,
  forecast: forecast,
  id: id
});

export const activateView = (viewName) => {
  return {
    type: t.ACTIVATE_VIEW,
    viewName: viewName
  }
}

export const fetchForecastFail = (error) => ({
  type: t.FETCH_FORECAST_FAIL,
  error: error
});

export const fetchForecastRequest = () => ({
  type: t.FETCH_FORECAST_REQUEST
});

export const fetchForecastSuccess = () => ({
  type: t.FETCH_FORECAST_SUCCESS
});

export const fetchWindFarmsFail = (error) => ({
  type: t.FETCH_WIND_FARMS_FAIL,
  error: error
});

export const fetchWindFarmsRequest = () => ({
  type: t.FETCH_WIND_FARMS_REQUEST
});

export const fetchWindFarmsSuccess = () => ({
  type: t.FETCH_WIND_FARMS_SUCCESS
});

export const mapMove = (visibleFarmIds) => ({
  type: t.MAP_MOVE,
  farmIds: visibleFarmIds
});

export const selectAggregation = (dataSource) => ({
  type: t.SELECT_AGGREGATION,
  dataSource: dataSource.value,
  title: dataSource.label
});

export const selectFeature = (feature) => ({
  type: t.SELECT_FEATURE,
  feature: feature
});

export const selectFeaturesByGroup = (groupFarmIds) => ({
  type: t.SELECT_FEATURES_BY_GROUP,
  farmIds: groupFarmIds
});

export const selectFeaturesByPolygon = (selectedFarmIds) => ({
  type: t.SELECT_FEATURES_BY_POLYGON,
  farmIds: selectedFarmIds
});

export const selectStyle = (style) => ({
  type: t.SELECT_STYLE,
  style: style
});

export const selectTimestamp = (timestamp) => ({
  type: t.SELECT_TIME,
  timestamp: timestamp
});

export const selectTimezoom = (timezoom) => ({
  type: t.SELECT_TIME_ZOOM,
  timezoom: timezoom
});


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// thunk action creators for async actions a la
// http://redux.js.org/docs/advanced/AsyncActions.html#async-action-creators
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const fetchForecast = (windFarms) => {
  return function(dispatch) {
    // notify the app that data is loading
    dispatch(fetchForecastRequest());

    Forecast.fetchBatchForecast(windFarms, 24)
      .then((forecast) => {
        dispatch(fetchForecastSuccess());
      })
      .catch((error) => {
        dispatch(fetchForecastFail(error))
      });
  }
}

export const fetchWindFarms = () => {
  return function(dispatch) {
    // notify app that data is loading
    dispatch(fetchWindFarmsRequest());

    // return a promise
    return WindFarm.fetchAllFarms()
      .then((response) => {
        dispatch(fetchWindFarmsSuccess());
        dispatch(fetchForecast(response.data));
      })
  }
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Bot Chart Actions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const selectBotChart = (chartType) => ({
  type: t.SELECT_BOT_CHART,
  chartType: chartType
});
export const addMultiChart = (selectedFeatureId) => ({
  type: t.ADD_MULTI_CHART,
  selectedFeatureId: selectedFeatureId
});
export const removeMultiChart = (selectedFeatureId) => ({
  type: t.REMOVE_MULTI_CHART,
  selectedFeatureId: selectedFeatureId
});
