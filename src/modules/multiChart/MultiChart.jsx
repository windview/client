import React from 'react';
import { connect } from 'react-redux';
import './MultiChart.scss';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import Highcharts from 'highcharts/highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import ForecastChart from '../forecastChart/ForecastChart';
// Stand up highcharts properly without the global var
HighchartsMore(Highcharts);

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
      There is no forecast data to display at the moment
    </BaseElement>
  )
}

// This is the main export
export class MultiChart extends React.Component {

  render() {
    console.log(this.props)
    var divs = [];
    var keys = Object.keys(this.props.state.analysis.multiChartMap);
    
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

export default connect(mapStateToProps, mapDispatchToProps)(MultiChart);
