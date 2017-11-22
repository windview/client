import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps } from './selectors';
import moment from 'moment';
import commafy from 'commafy';
import './FarmDetail.scss';

export class FarmDetail extends React.Component {

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
        return <tr key={rampBin.startTime.getTime()} className={className}><td>RAMP ALERT</td><td className="right">A {severity} event is forecast starting at {startTime} and ending at {endTime}</td></tr>;
      });
    }

    if(feature.properties.timestamp) {
      const displayTime = moment.utc(feature.properties.timestamp).format('HH:mm M/D UTC'),
            forecastMW = commafy(feature.properties.forecastMW) + " MW",
            forecast25MW = commafy(feature.properties.forecast25MW) + " MW",
            forecast75MW = commafy(feature.properties.forecast75MW) + " MW",
            actual = feature.properties.actual + " MW";
      appendRows.push(<tr key={feature.properties.fid + "-ts"}><td>Forecast Time</td><td className="right">{displayTime}</td></tr>)
      appendRows.push(<tr key={feature.properties.fid + "-fcst"}><td>Forecast Power</td><td className="right">{forecastMW}</td></tr>);
      appendRows.push(<tr key={feature.properties.fid + "-25"}><td>Forecast Power 25th Percentile</td><td className="right">{forecast25MW}</td></tr>);
      appendRows.push(<tr key={feature.properties.fid + "-75"}><td>Forecast Power 75th Percentile</td><td className="right">{forecast75MW}</td></tr>);
      if(actual) {
        appendRows.push(<tr key={feature.properties.fid + "-actl"}><td>Actual Power</td><td className="right">{actual}</td></tr>);
      }
    }
    const el = (
      <div>
        <table className="map-popup">
          <tbody>
          {prependRows}
          <tr>
            <td>Total Farm Capacity</td><td className="right">{commafy(feature.properties.total_capacity)} MW</td>
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

export default connect(mapStateToProps, null)(FarmDetail);
