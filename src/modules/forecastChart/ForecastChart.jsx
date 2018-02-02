import React from 'react';
import { connect } from 'react-redux';
import './ForecastChart.scss';
import { mapStateToProps } from './selectors';
import ChartElement from './chartElement/ChartElement';

// internal use only display components.
export const BaseElement = (props) => {
  return (
    <div id="chart-wrapper" className={props.multiChart ? "multi-forecast-chart-wrapper": "chart-wrapper"}>
      {props.children}
    </div>
  )
}

// internal use only display components.
const EmptyChartElement = () => {
  return (
    <BaseElement>
      Please click a region on the map to select a wind farm to view a forecast chart.
    </BaseElement>
  )
}

// This is the main export, simple as it is
export const ForecastChart = (props) => {

  const el = props.selectedFarmId || props.multiChart ? <ChartElement multiChart={props.multiChart} index={props.index} container={props.container} /> : <EmptyChartElement />;
  return (
    el
  );
}
export default connect(mapStateToProps, null)(ForecastChart);

// internal use only display components.
export const LoadingElement = (props) => {
  return (
    <BaseElement>
      <div className='chart-title'>Loading Forecast Chart for {props.label}</div>
      <div className='chart-loader'><i className="fa fa-4x fa-circle-o-notch fa-spin" aria-hidden="true"></i></div>
    </BaseElement>
  )
}
