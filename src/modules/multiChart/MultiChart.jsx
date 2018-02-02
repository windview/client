import React from 'react';
import { connect } from 'react-redux';
import './MultiChart.scss';
import { mapStateToProps } from './selectors';
import ForecastChart from '../forecastChart/ForecastChart';


// internal use only display components.
export const BaseElement = (props) => {
  return (
    <div id="multi-chart-container" className="multi-chart-container">
      {props.children}
    </div>
  )
}

const EmptyChartElement = () => {
  return (
    <BaseElement>
      <div className="multi-chart-info">There is no forecast data to display at the moment</div>
    </BaseElement>
  )
}

// This is the main export
export class MultiChart extends React.Component {

  render() {
    let divs = [],
        keys = this.props.multiChartMap;

    for(var i = 0; i < keys.length; i++){
      divs.push(<ForecastChart multiChart={true} index={keys[i]} container={'multiChartDiv'+keys[i]} key={keys[i]} />);
    }

    if(divs.length <= 0){
      divs.push(<EmptyChartElement key={0} />);
    }

    return (
      <div className="multi-chart-container">
        {divs}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(MultiChart);
