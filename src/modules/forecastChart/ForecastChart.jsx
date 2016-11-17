import React from 'react';
import { connect } from 'react-redux';
import './ForecastChart.scss';
import '../../styles/logo.scss';
import logo from '../../images/windview-chart.png';
import { mapStateToProps } from './selectors';

// A couple of internal use only display components. One
// would expect that in the fullness of time there would
// be several of these nested in their own files as 
// complexity grows
function BaseElement(props) {
  return (
    <div id="chart-wrapper" className="chart-wrapper half-v">
      {props.children}
    </div>
  )
}

function ChartElement(props) {
  return (
    <BaseElement>
      <div className='chart-title'>Forecast Chart for {props.feature.name}</div>
      <img src={logo} className="forecast-chart" alt="logo" />
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
