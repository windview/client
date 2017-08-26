import React from 'react';
import { connect } from 'react-redux';
import './AggregatedForecastChart.scss';
import { mapStateToProps } from './selectors';
import ChartElement from './chartElement/ChartElement';

// internal use only display components.
export const BaseElement = (props) => {
  return (
    <div id="aggregated-chart" className="aggregated-chart-container">
      {props.children}
    </div>
  )
}

// internal use only display components.
const EmptyChartElement = () => {
  return (
    <BaseElement>
      There is no data to display at the moment
    </BaseElement>
  )
}

// This is the main export, simple as it is
export const AggregatedForecastChart = ({forecast}) => {
  const el = forecast ? <ChartElement forecast={forecast} /> : <EmptyChartElement />;
  return (
    el
  );
}

export default connect(mapStateToProps, null)(AggregatedForecastChart);
