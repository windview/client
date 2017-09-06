// navBar/selectors

import { activateView } from '../../actionCreators';

export const mapStateToProps = (state, ownProps) => {
  return {
    activePane: state.nav.activePane
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (viewName) => {
      dispatch(activateView(viewName));
    }
  }
}
