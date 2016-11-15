import React from 'react';
import { connect } from 'react-redux';
import './ForecastChart.scss';
import '../../styles/logo.scss';
import logo from '../../images/logo.svg';
import { mapStateToProps } from './selectors';

function BaseElement(props) {
  return (
    <div id="forecast-chart" className="half-v">
      {props.children}
    </div>
  )
}

function ChartElement(props) {
  return (
    <BaseElement>
      Forecast Chart for {props.feature.name}<br />
      <img src={logo} className="App-logo" alt="logo" />
    </BaseElement>
  )
}

function EmptyChartElement() {
  return (
    <BaseElement>
      Please click a region on the map to select a wind farm to view a forecast chart.
    </BaseElement>
  )
}

export const ForecastChart = ({
  feature
}) => {
  const el = feature ? <ChartElement feature={feature} /> : <EmptyChartElement />
  return (
    el
  );
}

export default connect(mapStateToProps, null)(ForecastChart);
