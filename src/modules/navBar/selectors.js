// navBar/selectors.js

import { activateView } from '../app/actions';

export const mapStateToProps = (state, ownProps) => {
  return {
    activePane: state.app.activePane
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (viewName) => {
      dispatch(activateView(viewName));
    }
  }
}
