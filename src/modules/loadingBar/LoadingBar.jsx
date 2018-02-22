import React from 'react';
import { connect } from 'react-redux';
import './LoadingBar.scss';
import {mapStateToProps} from './selectors';

class LoadingBar extends React.Component {

  render() {
    let loading;
    let loadingMessage = this.props.windFarmsLoading ? "Loading wind farms..." : "Loading forecasts..."
    if (this.props.windFarmsLoading || this.props.forecastLoading) {
      loading = (
        <div id="loading-bar">
        <img src="/images/loading.gif" alt="loading" height="15px"/>
        <p id="loading-message">{loadingMessage}</p>
        </div>
      )
    } else {
      loading = null;
    }

    return (
      <div id="loading-bar-container">
      {loading}
      </div>
    )
  }
}

export default connect(mapStateToProps, null)(LoadingBar);
