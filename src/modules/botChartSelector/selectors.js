// botChartSelector/selectors

import * as actions from '../../actionCreators';

export const mapStateToProps = (state, ownProps) => {
  return {
    aggregatedSource: state.analysis.dataSource,
    botChartType: state.nav.botChartType,
    selectedGroupLabel: state.analysis.selectedGroupLabel
  }
}
export const mapDispatchToProps = (dispatch) => {
  return {
    onSelectBotChart: (chartType) => {
      dispatch(actions.selectBotChart(chartType));
    },
    onSetAggHighlight: (lightitup) => {
      dispatch(actions.setAggSetHighlight(lightitup));
    }
  }
}