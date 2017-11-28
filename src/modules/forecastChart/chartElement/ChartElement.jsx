import { BaseElement, LoadingElement } from '../ForecastChart';
import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import '../ForecastChart.scss';
import Highcharts from 'highcharts/highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
// Stand up highcharts properly without the global var
HighchartsMore(Highcharts);

export class ChartElement extends React.Component {

  constructor(props) {
    super(props);
    this.addMultiChart = this.addMultiChart.bind(this);
    this.removeMultiChart = this.removeMultiChart.bind(this);
  }

  chartIt() {
    var selectedFeature = this.props.feature;
    var container = "forecast-chart";
    if(this.props.multiChart){
      selectedFeature = this.props.analysis.multiChartMap[this.props.index];
      container = this.props.container;
    }
    const data = this.getChartData(selectedFeature.properties.forecastData),
          forecast = data[0],
          range = data[1],
          twentyFive = data[2],
          seventyFive = data[3],
          actuals = data[4],
          range1_99 = data[5],
          one = data[6],
          ninetynine = data[7],
          now = window.fakeNow;

    if(this.chart) {
      this.chart.destroy();
    }

    let chart = Highcharts.chart(container, {
      chart: {
        height: 240,
        spacingBottom: 5
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Timestamp UTC'
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
        enabled: true,
        align: 'center',
        itemDistance: 10
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
        name: '1% Probability',
        data: one,
        color: '#bbb',
        zIndex: 3,
        marker: {
          enabled: false,
          lineWidth: .2,
          lineColor: '#fff',
          symbol: "triangle-down"
        }
      }, {
        name: '25% Probability',
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
        name: '75% Probability',
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
        name: '99% Probability',
        data: ninetynine,
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
        zIndex: 1,
        enableMouseTracking: false
      }, {
        name: 'Range1-99',
        data: range1_99,
        type: 'arearange',
        lineWidth: 0,
        linkedTo: ':previous',
        color: '#ddd',
        fillOpacity: 1,
        zIndex: 0,
        enableMouseTracking: false
      }]
    });

    const rampBins = selectedFeature.properties.forecastData.alerts.rampBins;
    rampBins.forEach((bin)=>{
      const color = bin.increments[bin.increments.length-1] > 0 ? "rgba(205, 186, 45, 0.63)" : "rgba(117, 140, 225, 0.53)",
            borderColor = bin.severity > 1 ? "rgba(255, 0, 0, 0.7" : color;
      chart.xAxis[0].addPlotBand({
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
    if(this.props.feature || this.props.multiChart) {
      this.chartIt();
      if(this.props.selectedTimestamp) {
        this.drawPlotLine(this.props.selectedTimestamp);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.feature || this.props.multiChart) {
      if(prevProps.feature) {
        // if the currently selected feature is not the same as the previously selected
        if(this.props.feature.properties.fid !== prevProps.feature.properties.fid
          || this.props.index !== prevProps.index) {
          this.chartIt();
        }
      } else {
        // there was no feature selected previously
        this.chartIt();
      }
    }
    if(this.props.selectedTimestamp) {
      this.drawPlotLine(this.props.selectedTimestamp);
    }
  }

  drawPlotLine(timestamp) {
    if(this.chart) {
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

  /*
   * Formats the data for Highcharts. Creates 5 arrays, one each
   * for forecast, arearange, 25th, 75th, and the actuals
   */
  getChartData(featureData) {
    /*
    * Add temporary random forecast1MW, forecast99MW Data
    */
    let rand_1MW, rand_99MW;
    let retval = [[], [], [], [], [], [], [], []];  //3 coulmns are added at the last: range, forecast1MW, forcast99MW
    featureData.data.forEach((row)=>{
      rand_1MW = 1.0 + (Math.random() * 3);
      rand_99MW = 1.0 + (Math.random() * 3);
      retval[0].push([row.timestamp.getTime(), row.forecastMW]);
      retval[1].push([row.timestamp.getTime(), row.forecast25MW, row.forecast75MW]);
      retval[2].push([row.timestamp.getTime(), row.forecast25MW]);
      retval[3].push([row.timestamp.getTime(), row.forecast75MW]);
      retval[4].push([row.timestamp.getTime(), row.actual]);
      retval[5].push([row.timestamp.getTime(), (row.forecast25MW - rand_1MW < 0 ? 0 : row.forecast25MW - rand_1MW), row.forecast75MW + rand_99MW]);
      retval[6].push([row.timestamp.getTime(), (row.forecast25MW - rand_1MW < 0 ? 0 : row.forecast25MW - rand_1MW)]);
      retval[7].push([row.timestamp.getTime(), row.forecast75MW + rand_99MW]);
    });
    return retval;
  }

  render() {
    var selectedFeature = this.props.feature;
    var container = "forecast-chart";
    var button = <button type="button" onClick={this.addMultiChart}>+</button>;
    if(this.props.multiChart){
      selectedFeature = this.props.analysis.multiChartMap[this.props.index];
      container = this.props.container;
      button = <button type="button" id={'btn'+selectedFeature.properties.fid} value={selectedFeature.properties.fid} onClick={() => this.removeMultiChart(selectedFeature.properties.fid)}>-</button>;
    }

    const feature = selectedFeature;
    const id = container;
    const btn = button;
    return feature.loading ? <LoadingElement feature={feature} /> : (
      <BaseElement multiChart={this.props.multiChart}>
        <div className='chart-title'>Details and Forecast for {feature.properties.label} {btn}
        </div>
        <div id={id} className={this.props.multiChart ? 'multi-forecast-chart':''}></div>
      </BaseElement>
    )
  }

  addMultiChart() {
    this.props.onAddMultiChart(this.props.feature);
  }
  removeMultiChart(fid){
    this.props.onRemoveMultiChart(fid);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartElement);
