import React from 'react';
import { connect } from 'react-redux';
import './AggregatedForecastChart.scss';
import { mapStateToProps } from './selectors';
import Forecast from '../../data/forecast';
import Farms from '../../data/windFarm';
import CONFIG from '../../data/config';
import Highcharts from 'highcharts/highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
// Stand up highcharts properly without the global var
HighchartsMore(Highcharts);

// internal use only display components.
export const BaseElement = (props) => {
  return (
    <div id="aggregated-chart-container" className="aggregated-chart-container">
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

const ChartElement = () => {
  return (
    <BaseElement>
      <div id="aggregated-chart"></div>
    </BaseElement>
  )
}

// This is the main export
export class AggregatedForecastChart extends React.Component {

  chartIt() {
    let aggData = Forecast.getAggregatedForecast(this.getForecasts());
    if(!aggData) {
      if(this.chart) {
        this.clearChart();
      }
      return;
    }

    const data = this.getChartData(aggData),
          forecast = data[0],
          actuals = data[1],
          now = CONFIG.now;

    let yAxisMax = Farms.getTotalCapacity();
    // Possible for forecast probability to exceed total farm capacity,
    // add a 10% buffer on the top of the chart just in case
    yAxisMax = Math.ceil(yAxisMax*.1 + yAxisMax);
    let yAxisMin = 0;

    let chart = Highcharts.chart('aggregated-chart', {
      chart: {
        spacingBottom: 10
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: ''
        },
        plotLines: [{
          id: 'now',
          color: "#000",
          value: now,
          width: 2,
          zIndex: 5,
          dashStyle: "Solid"
        }]
      },
      yAxis: {
        min: yAxisMin,
        max: yAxisMax,
        minRange: yAxisMax-yAxisMin,
        opposite: true,
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
        enabled: false,
        floating: true,
        align: 'center',
        verticalAlign: 'top'
      },
      series: [{
        name: 'Forecast',
        data: forecast,
        zIndex: 4,
        color: '#000',
        lineWidth: 2,
        dashStyle: 'Solid',
        marker: {
          enabled: false,
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
      }],
      credits: {
        enabled: false
      }
    });

    const rampBins = aggData.alerts.rampBins;
    rampBins.forEach((bin)=>{
      // color depending on wether the ramp is going up or down
      let color, borderColor, label;
      switch(bin.severity) {
        case 1:
          color = "hsla(53, 100%, 54%, 0.4)";
          borderColor = "hsla(53, 100%, 54%, 1)";
          break;
        case 2:
          color = "hsla(31, 100%, 54%, 0.4)";
          borderColor = "hsla(31, 100%, 54%, 1)";
          break;
        default:
          color = " hsla(0, 100%, 37%, 0.4)";
          borderColor = "hsla(0, 100%, 37%, 1)";
      }
      label =  bin.direction === 'up' ? '<<<<<<': '>>>>>>';

      chart.xAxis[0].addPlotBand({
        label: {
          text: label,
          rotation: 90,
          verticalAlign: 'middle',
          x: -3,
          y: 2
        },
        color: color,
        borderColor: borderColor,
        borderWidth: 2,
        from: bin.startTime,
        to: bin.endTime,
        zIndex: 2
      });
    }, this);

    this.chart = chart;

    let forecastTimestamp = Forecast.getForecastTimestamp();
    this.drawForecastTime(forecastTimestamp);
  }

  clearChart() {
    if(this.chart) {
      this.chart.destroy();
      this.chart = null;
      $("#aggregated-chart").text("Please select an aggregation set.");
    }
  }

  componentDidMount() {
    let aggDataSource = this.getAggregatedDataIds(this.props);
    if(aggDataSource && this.props.forecastLoaded) {
      this.chartIt();
      if(this.props.selectedTimestamp) {
        this.drawSelectedTime(this.props.selectedTimestamp);
      }
    }
  }

  componentDidUpdate(prevProps) {
    let aggDataSource = this.getAggregatedDataIds(this.props);
    let prevDataSource = this.getAggregatedDataIds(prevProps);
    if(this.props.forecastLoaded) {
      if(aggDataSource && aggDataSource.length > 0) {
        if(prevDataSource) {
          if(!prevProps.forecastLoaded || this.farmsHaveChanged(prevDataSource, aggDataSource)) {
            this.chartIt();
          }
        } else {
          this.chartIt();
        }
      } else {
        this.clearChart();
      }
      if(this.props.aggregatedSource !== prevProps.aggregatedSource) {
        this.chartIt();
      }
      if(aggDataSource === null) {
        this.chartIt();
      }
      if(this.props.selectedTimestamp && this.chart) {
        this.drawSelectedTime(this.props.selectedTimestamp);
      }
      if((prevProps.settingsTimestamp !== this.props.settingsTimestamp)
          || (prevProps.forecastTimestamp !== this.props.forecastTimestamp)){
        this.chartIt();
      }
    }
  }

  drawSelectedTime(timestamp) {
    if(this.chart.xAxis) {
      this.chart.xAxis[0].removePlotLine('selectedTimestamp');
      this.chart.xAxis[0].addPlotLine({
        id: 'selectedTimestamp',
        color: "#666",
        value: timestamp,
        width: 2,
        zIndex: 5,
        dashStyle: "Dash"
      });
    }
  }

  drawForecastTime(timestamp) {
    if(this.chart.xAxis) {
      this.chart.xAxis[0].removePlotLine('forecastTimestamp');
      this.chart.xAxis[0].addPlotLine({
        id: 'forecastTimestamp',
        color: "#00750c",
        value: timestamp,
        width: 3,
        zIndex: 5,
        dashStyle: "ShortDash"
      });
    }
  }

  farmsHaveChanged(prev, current) {
    // Super simple check may bypass the need for doing any introspection
    if(prev.length !== current.length) {
      return true;
    } else {
      // here we know the sets are the same length, and we don't care about
      // the details of the diff only that there is a diff, so a simple one-way
      // id check is sufficient
      const leftovers = current.filter( fid=>!prev.includes(fid) )
      return leftovers.length > 0
    }
  }

  getAggregatedDataIds(props) {
    let retVal = [];
    if (this.props.aggregatedSource === 'visibleFarms') {
      retVal = props.visibleFarmIds;
    }
    if (this.props.aggregatedSource === 'polygonFarms') {
      retVal = props.selectedFarmIdsByPolygon;
    }
    if (this.props.aggregatedSource === 'groupedFarms') {
      retVal = props.selectedFarmIdsByGroup;
    }
    return retVal;
  }

  /*
   * Formats the data for Highcharts. Creates 5 arrays, one each
   * for forecast, arearange, 25th, 75th, and the actuals
   */
  getChartData(featureData) {
    let retval = [[], []];
    featureData.data.forEach((row)=>{
      retval[0].push([row.timestamp.getTime(), row.forecastMW]);
      retval[1].push([row.timestamp.getTime(), row.actual]);
    });
    return retval;
  }

  getForecasts() {
    let retval = [];
    let aggDataSource = this.getAggregatedDataIds(this.props);
    if(aggDataSource.length > 0) {
      aggDataSource.forEach(farmId=>{
        retval.push(Forecast.getForecastForFarm(farmId));
      })
    }
    return retval.filter(r=>r); // filter out falsy values
  }

  render() {
    const el = this.props.forecastLoaded ? <ChartElement /> : <EmptyChartElement />;
    return (
      el
    );
  }
}

export default connect(mapStateToProps, null)(AggregatedForecastChart);
