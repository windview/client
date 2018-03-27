// navBar/selectors

import { activateView, selectAggregation, selectFeaturesByGroup } from '../../actionCreators';

export const mapStateToProps = (state, ownProps) => {
  return {
    activePane: state.nav.activePane,
    settingsTimestamp: state.data.settingsTimestamp
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (viewName) => {
      dispatch(activateView(viewName));
    },
    onSelectAggregation: (dataSource) => {
      dispatch(selectAggregation(dataSource));
    },
    onSelectFeaturesByGroup: (feature) => {
      dispatch(selectFeaturesByGroup(feature));
    }
  }
}
