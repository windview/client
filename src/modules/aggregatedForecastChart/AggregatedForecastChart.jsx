import React from 'react';
import { connect } from 'react-redux';
import './AggregatedForecastChart.scss';
import { mapStateToProps } from './selectors';
import Forecast from '../../data/forecast';
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
    let aggData = Forecast.getAggregatedForecast(this.getForecasts())
    if(!aggData) {
      if(this.chart) {
        this.chart.destroy();
        if (this.props.aggregatedSource === 'polygonFarms') {
          $('#aggregated-chart').text('Select desired wind farms using the polygon selection tool in the upper right corner of the map.')
        }
        if (this.props.aggregatedSource === 'visibleFarms') {
          $('#aggregated-chart').text('Move the map or zoom out so wind farms are visible.')
        }
        if (this.props.aggregatedSource === 'groupedFarms') {
          $('#aggregated-chart').text('Select the desired group of wind farms from the dropdown menu in the navigation bar.')
        }
      }
      return;
    }

    const data = this.getChartData(aggData),
          forecast = data[0],
          actuals = data[1],
          now = window.fakeNow;


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
      const color = bin.increments[bin.increments.length-1] > 0 ? "rgba(205, 186, 45, 0.63)" : "rgba(117, 140, 225, 0.53)",
            label =  bin.increments[bin.increments.length-1] > 0 ? '<<<<<<': '>>>>>>',
            borderColor = bin.severity > 1 ? "rgba(255, 0, 0, 0.7" : color;
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
  }

  componentDidMount() {
    let aggDataSource = this.getAggregatedSourceData();
    if(aggDataSource && this.props.forecast) {
      this.chartIt();
      if(this.props.selectedTimestamp) {
        this.drawPlotLine(this.props.selectedTimestamp);
      }
    }
  }

  componentDidUpdate(prevProps) {
    let aggDataSource = this.getAggregatedSourceData();
    let prevDataSource = this.getAggregatedPrevData(prevProps);
    if(this.props.forecast) {
      if(aggDataSource) {
        if(prevDataSource) {
          if(this.farmsHaveChanged(prevDataSource, aggDataSource)) {
            this.chartIt();
          }
        } else {
          this.chartIt();
        }
      }
      if(this.props.selectedTimestamp && this.chart) {
        this.drawPlotLine(this.props.selectedTimestamp);
      }
      if(this.props.aggregatedSource !== prevProps.aggregatedSource) {
        this.chartIt();
      }
      if(aggDataSource === null) {
        this.chartIt();
      }
    }
  }

  drawPlotLine(timestamp) {
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

  farmsHaveChanged(prev, current) {
    let prevFids = prev.map(i=>i.properties.fid),
        currentFids = current.map(i=>i.properties.fid);

    // Super simple check may bypass the need for doing any introspection
    if(prevFids.length !== currentFids.length) {
      return true;
    } else {
      // here we know the sets are the same length, and we don't care about
      // the details of the diff only that there is a diff, so a simple one-way
      // id check is sufficient
      const leftovers = currentFids.filter( fid=>!prevFids.includes(fid) )
      return leftovers.length > 0
    }
  }

  getAggregatedPrevData(prevProps) {
    if (this.props.aggregatedSource === 'visibleFarms') {
      return prevProps.visibleWindFarms
    }
    if (this.props.aggregatedSource === 'polygonFarms') {
      return prevProps.selectedWindFarmsByPolygon
    }
  }

  getAggregatedSourceData() {
    if (this.props.aggregatedSource === 'visibleFarms') {
      return this.props.visibleWindFarms
    }
    if (this.props.aggregatedSource === 'polygonFarms') {
      return this.props.selectedWindFarmsByPolygon
    }
    if (this.props.aggregatedSource === 'groupedFarms') {
      return this.props.selectedWindFarmsByGroup
    }
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
    let aggDataSource = this.getAggregatedSourceData();
    if(aggDataSource) {
      aggDataSource.forEach(farm=>{
        retval.push(Forecast.getForecastForFarm(farm.properties.fid, this.props.forecast));
      })
    }
    return retval.filter(r=>r); // filter out falsy values
  }

  render() {
    const el = this.props.forecast ? <ChartElement /> : <EmptyChartElement />;
    return (
      el
    );
  }
}

export default connect(mapStateToProps, null)(AggregatedForecastChart);
