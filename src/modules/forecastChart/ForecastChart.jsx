import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps } from './selectors';
import './ForecastChart.scss';
import Highcharts from 'highcharts/highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
// Stand up highcharts properly without the global var
HighchartsMore(Highcharts);

// internal use only display components.
const BaseElement = (props) => {
  return (
    <div id="chart-wrapper" className="chart-wrapper">
      {props.children}
    </div>
  )
}

// internal use only display components.
class ChartElement extends React.Component {

  chartIt() {
    const data = this.getChartData(this.props.feature.properties.forecastData),
          forecast = data[0],
          range = data[1],
          twentyFive = data[2],
          seventyFive = data[3],
          actuals = data[4].slice(0, 59),
          now = data[4][59];

    let chart = Highcharts.chart('forecast-chart', {
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Timestamp UTC'
        },
        plotLines: [{
          color: "#000",
          value: now[0],
          width: 2,
          zIndex: 5,
          dashStyle: "Solid"
        }]
      },
      yAxis: {
        title: {
          text: "Power (MW)"
        }
      },
      tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: ' MW'
      },
      legend: {
        enabled: true
      },
      series: [{
        name: 'Forecast',
        data: forecast,
        zIndex: 4,
        color: '#fff',
        lineWidth: 3.5,
        dashStyle: 'Solid',
        marker: {
          lineWidth: 1,
          lineColor: '#699173',
          symbol: "circle"
        }
      }, {
        name: 'Actual',
        data: actuals,
        dashStyle: "ShortDash",
        color: '#002a66',
        lineWidth: 2,
        zIndex: 5,
        marker: {
          enabled: false,
          lineWidth: 1,
          lineColor: '#fff',
          symbol: "square"
        }
      }, {
        name: '25th Percentile',
        data: twentyFive,
        color: '#bbb',
        zIndex: 3,
        marker: {
          enabled: false,
          lineWidth: .2,
          lineColor: '#fff',
          symbol: "triangle-down"
        }
      }, {
        name: '75th Percentile',
        data: seventyFive,
        color: '#bbb',
        zIndex: 3,
        marker: {
          enabled: false,
          lineWidth: .2,
          lineColor: '#fff',
          symbol: "triangle"
        }
      }, {
        name: 'Range',
        data: range,
        type: 'arearange',
        lineWidth: 0,
        linkedTo: ':previous',
        color: '#666',
        fillOpacity: 1,
        zIndex: 0,
        enableMouseTracking: false
      }]
    });

    const rampBins = this.props.feature.properties.rampBins;
    rampBins.forEach((bin)=>{
      //rampdown color
      //color: "rgba(117, 140, 225, 0.53)",
      chart.xAxis[0].addPlotBand({
        color: "rgba(205, 186, 45, 0.63)",
        from: bin.startTime,
        to: bin.endTime,
        zIndex: 2
      });
    }, this);

    this.chart = chart;
  }

  componentDidMount() {
    this.chartIt();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.feature) {
      let redrawChart = false;
      if(this.props.feature) {
        // if the currently selected feature is not the same as the previously selected
        if(this.props.feature.properties.fid !== nextProps.feature.properties.fid) {
          redrawChart = true;
        }
      } else {
        // there was no feature selected previously
        redrawChart = true;
      }
      
      if(redrawChart) {
        console.log("Update the chart with fresh data");
      }
    }
  }

  /* 
   * Formats the data for Highcharts. Creates 5 arrays, one each
   * for forecast, arearange, 25th, 75th, and the actuals 
   */
  getChartData(featureData) {
    let retval = [[], [], [], [], []];
    featureData.data.forEach((row)=>{
      retval[0].push([row.timestamp.getTime(), row.forecastMW]);
      retval[1].push([row.timestamp.getTime(), row.forecast25MW, row.forecast75MW]);
      retval[2].push([row.timestamp.getTime(), row.forecast25MW]);
      retval[3].push([row.timestamp.getTime(), row.forecast75MW]);
      retval[4].push([row.timestamp.getTime(), row.actual]);
    });
    return retval;
  }

  render() {
    const feature = this.props.feature;
    return feature.loading ? <LoadingElement feature={feature} /> : (
      <BaseElement>
        <div className='chart-title'>Forecast for {feature.properties.label}</div>
        <div id="forecast-chart"></div>
      </BaseElement>
    )
  }
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
export const ForecastChart = ({feature}) => {
  const el = feature ? <ChartElement feature={feature} /> : <EmptyChartElement />;
  return (    
    el
  );
}
export default connect(mapStateToProps, null)(ForecastChart);

// internal use only display components.
const LoadingElement = (props) => {
  return (
    <BaseElement>
      <div className='chart-title'>Loading Forecast Chart for {props.feature.properties.label}</div>
      <div className='chart-loader'><i className="fa fa-4x fa-circle-o-notch fa-spin" aria-hidden="true"></i></div>
    </BaseElement>
  )
}
