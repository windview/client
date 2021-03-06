import { BaseElement, LoadingElement } from '../ForecastChart';
import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import '../ForecastChart.scss';
import Highcharts from 'highcharts/highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import Forecast from '../../../data/forecast';
import WindFarm from '../../../data/windFarm';
import CONFIG from '../../../data/config';

// Stand up highcharts properly without the global var
HighchartsMore(Highcharts);

export class ChartElement extends React.Component {

  constructor(props) {
    super(props);
    this.addMultiChart = this.addMultiChart.bind(this);
    this.removeMultiChart = this.removeMultiChart.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  chartIt() {
    let selectedFeatureId,
        feature,
        forecastData,
        container;

    if(this.props.multiChart) {
      selectedFeatureId = this.props.farmId;
      container = this.props.container;
    } else {
      selectedFeatureId = this.props.selectedFarmId;
      container = "forecast-chart";
    }

    feature = selectedFeatureId ? WindFarm.getWindFarmById(selectedFeatureId) : null;
    forecastData = feature ? Forecast.getForecastForFarm(feature.id) : null;

    let yAxisMax = feature.capacity_mw;
    // Possible for forecast probability to exceed total farm capacity,
    // add a 5% buffer on the top of the chart just in case
    yAxisMax = Math.ceil(yAxisMax*.05 + yAxisMax);
    let yAxisMin = 0;

    const data = this.getChartData(forecastData),
          forecastType = forecastData.type,
          forecast = data[0],
          range = data[1],
          twentyFive = data[2],
          seventyFive = data[3],
          actuals = data[4],
          range1_99 = data[5],
          one = data[6],
          ninetynine = data[7],
          now = CONFIG.now;

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
        min: yAxisMin,
        max: yAxisMax,
        minRange: yAxisMax-yAxisMin,
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
        color: forecastType === "point" ? "#000" : "#fff",
        lineWidth: forecastType === "point" ? 2 : 3.5,
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
        name: '1st Percentile',
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
        name: '99th Percentile',
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

    const rampBins = forecastData.alerts.rampBins;
    rampBins.forEach((bin)=>{
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
      label =  bin.direction === 'up' ? '<<<<<<<<<<<': '>>>>>>>>>>>';

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

    let forecastTimestamp = Forecast.getForecastTimestamp(forecastData.id);
    this.drawForecastTime(forecastTimestamp);

    $('[data-toggle="tooltip"]').tooltip()
  }

  componentDidMount() {
    if(this.props.selectedFarmId || this.props.multiChart) {
      this.chartIt();
      if(this.props.selectedTimestamp) {
        this.drawSelectedTime(this.props.selectedTimestamp);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.selectedFarmId || this.props.multiChart) {
      if(prevProps.forecastTimestamp !== this.props.forecastTimestamp) {
        this.chartIt();
      }else if(prevProps.settingsTimestamp !== this.props.settingsTimestamp) {
        this.chartIt();
      } else if(prevProps.selectedFarmId) {
        // if the currently selected feature is not the same as the previously selected
        if(this.props.selectedFarmId !== prevProps.selectedFarmId
          || this.props.index !== prevProps.index) {
          this.chartIt();
        }
      } else {
        // there was no feature selected previously
        this.chartIt();
      }
    }
    if(this.props.selectedTimestamp) {
      this.drawSelectedTime(this.props.selectedTimestamp);
    }
  }

  drawSelectedTime(timestamp) {
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

  /*
   * Formats the data for Highcharts. Creates 5 arrays, one each
   * for forecast, arearange, 25th, 75th, and the actuals
   * forecast = data[0],
   * range = data[1],
   * twentyFive = data[2],
   * seventyFive = data[3],
   * actuals = data[4],
   * range1_99 = data[5],
   * one = data[6],
   * ninetynine = data[7],
   */
  getChartData(forecast) {
    let retval = [[], [], [], [], [], [], [], []];
    forecast.data.forEach((row)=>{
      retval[0].push([row.timestamp.getTime(), row.bestForecastMW]);
      retval[1].push([row.timestamp.getTime(), row.prob25thQuantForecastMW, row.prob75thQuantForecastMW]);
      retval[2].push([row.timestamp.getTime(), row.prob25thQuantForecastMW]);
      retval[3].push([row.timestamp.getTime(), row.prob75thQuantForecastMW]);
      retval[4].push([row.timestamp.getTime(), row.actual]);
      retval[5].push([row.timestamp.getTime(), row.prob1stQuantForecastMW, row.prob99thQuantForecastMW]);
      retval[6].push([row.timestamp.getTime(), row.prob1stQuantForecastMW]);
      retval[7].push([row.timestamp.getTime(), row.prob99thQuantForecastMW]);
    });
    return retval;
  }

  render() {
    let selectedFeatureId = this.props.selectedFarmId,
        selectedFeature = selectedFeatureId ? WindFarm.getWindFarmById(selectedFeatureId) : null,
        container = "forecast-chart",
        button = <button type="button" className="multibutton" data-toggle="tooltip" data-placement="bottom" title="Add to Multi Chart View" onClick={this.addMultiChart}>+</button>;

    if(this.props.multiChart){
      selectedFeatureId = this.props.farmId;
      selectedFeature = selectedFeatureId ? WindFarm.getWindFarmById(selectedFeatureId) : null;
      container = this.props.container;
      button = <button type="button" className="multibutton" data-toggle="tooltip" data-placement="bottom" title="Remove From Multi Chart View" onClick={this.removeMultiChart}>-</button>;
    }

    return selectedFeature.loading ? <LoadingElement label={selectedFeature.name} /> :
      (
        <BaseElement multiChart={this.props.multiChart}>
          <div className='chart-title' onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>{selectedFeature.name} {button}
          </div>
          <div id={container} className={this.props.multiChart ? 'multi-forecast-chart':''}></div>
        </BaseElement>
      )
  }

  addMultiChart() {
    this.props.onAddMultiChart(this.props.selectedFarmId);
  }

  removeMultiChart(){
    this.props.onRemoveMultiChart(this.props.farmId);
  }

  onMouseOver() {
    let farmId = this.props.multiChart ? this.props.farmId : this.props.selectedFarmId;
    this.props.onTitleHover(farmId);
  }

  onMouseOut() {
    let farmId = this.props.multiChart ? this.props.farmId : this.props.selectedFarmId;
    this.props.unTitleHover(farmId);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartElement);
