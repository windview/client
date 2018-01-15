import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import moment from 'moment';
import commafy from 'commafy';
import './FarmDetail.scss';

export class FarmDetail extends React.Component {

  handleAcknowledgeAlert(id) {
    let forecast = this.props.forecast;
    this.props.onToggleAlert(forecast, id)
  }

  getDetailMarkup() {

    let prependRows = [],
        appendRows = [],
        feature = this.props.feature;


    if(feature.properties.forecastData.alerts.hasRamp) {
      prependRows = feature.properties.forecastData.alerts.rampBins.map((rampBin) => {
        const startTime = moment.utc(rampBin.startTime).format('HH:mm UTC'),
              endTime = moment.utc(rampBin.endTime).format('HH:mm UTC'),
              severity = rampBin.severity > 1 ? "severe ramp" : "moderate ramp",
              className = rampBin.severity > 1 ? "severe" : "moderate";

        if (feature.displayAlerts !== false) {
          return <tr key={rampBin.startTime.getTime()} className={className}><td>RAMP ALERT</td><td className="right">A {severity} event is forecast starting at {startTime} and ending at {endTime}</td><td><button onClick={()=>this.handleAcknowledgeAlert(rampBin)} type="button">Toggle Alert</button></td></tr>;
        }

        return null;
      });
    }

    if(feature.properties.timestamp) {
      const displayTime = moment.utc(feature.properties.timestamp).format('HH:mm M/D UTC'),
            forecastMW = commafy(feature.properties.bestForecastMW) + " MW",
            prob1stQuantForecastMW = commafy(feature.properties.prob1stQuantForecastMW) + " MW",
            prob25thQuantForecastMW = commafy(feature.properties.prob25thQuantForecastMW) + " MW",
            prob75thQuantForecastMW = commafy(feature.properties.prob75thQuantForecastMW) + " MW",
            prob99thQuantForecastMW = commafy(feature.properties.prob99thQuantForecastMW) + " MW",
            actual = (feature.properties.actual ? feature.properties + " MW" : "unknown");
      appendRows.push(<tr key={feature.properties.fid + "-ts"}><td>Forecast Time</td><td className="right">{displayTime}</td></tr>)
      appendRows.push(<tr key={feature.properties.id + "-fst"}><td>Forecast Power</td><td className="right">{forecastMW}</td></tr>);
      appendRows.push(<tr key={feature.properties.id + "-1"}><td>Forecast Power 1st Percentile</td><td className="right">{prob1stQuantForecastMW}</td></tr>);
      appendRows.push(<tr key={feature.properties.id + "-25"}><td>Forecast Power 25th Percentile</td><td className="right">{prob25thQuantForecastMW}</td></tr>);
      appendRows.push(<tr key={feature.properties.id + "-75"}><td>Forecast Power 75th Percentile</td><td className="right">{prob75thQuantForecastMW}</td></tr>);
      appendRows.push(<tr key={feature.properties.id + "-99"}><td>Forecast Power 99th Percentile</td><td className="right">{prob99thQuantForecastMW}</td></tr>);
      appendRows.push(<tr key={feature.properties.id + "-actl"}><td>Actual Power</td><td className="right">{actual}</td></tr>);
    }
    const el = (
      <div>
        <table className="map-popup">
          <tbody>
          {prependRows}
          <tr>
            <td>Total Farm Capacity</td><td className="right">{commafy(feature.properties.capacity_mw)} MW</td>
          </tr><tr>
            <td>Turbine Manufacturer(s)</td><td className="right">{'manufacturers' in feature.properties ? feature.properties.manufacturers.join(', ') : "unknown"}</td>
          </tr><tr>
            <td>Turbine Models</td><td className="right">{'models' in feature.properties ? feature.properties.models.join(', ') : "unknown" }</td>
          </tr>
          {appendRows}
          </tbody>
        </table>
      </div>
    );
    return el;
  }

  render() {
    if(!this.props.feature) {
      return <div id="farmDetail"></div>
    } else {
      return this.getDetailMarkup()
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FarmDetail);
