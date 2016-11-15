import React from 'react';
import { connect } from 'react-redux';
import './ForecastChart.scss';
import '../../styles/logo.scss';
import logo from '../../images/logo.svg';
import { mapStateToProps } from './selectors';

export const ForecastChart = ({
  feature
}) => {
  return (
    <div id="forecast-chart" className="half-v">
      Behold the Forecast Chart {feature.name}<br />
      <img src={logo} className="App-logo" alt="logo" />
    </div>
  );
}

export default connect(mapStateToProps, null)(ForecastChart);
