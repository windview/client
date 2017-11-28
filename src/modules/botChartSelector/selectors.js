// botChartSelector/selectors

import * as actions from '../../actionCreators';

export const mapStateToProps = (state, ownProps) => {
  return {
    state: state,
    ownProps: ownProps,
  }
}
export const mapDispatchToProps = (dispatch) => {
  return {
    onSelectBotChart: (chartType) => {
      dispatch(actions.selectBotChart(chartType));
    }
  }
}