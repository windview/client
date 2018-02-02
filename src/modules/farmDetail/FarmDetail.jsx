import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import moment from 'moment';
import commafy from 'commafy';
import './FarmDetail.scss';
import WindFarm from '../../data/windFarm';
import Forecast from '../../data/forecast';


export class FarmDetail extends React.Component {

  // FIXME
  handleAcknowledgeAlert(id) {
    debugger;
    let forecast = this.props.forecast;
    this.props.onToggleAlert(forecast, id)
  }

  getDetailMarkup() {

    let prependRows = [],
        appendRows = [],
        farm = WindFarm.getWindFarmById(this.props.selectedFarmId),
        forecastData = Forecast.getForecastForFarm(farm.id);

    // FIXME make sure this is the right property accessor
    if(forecastData.alerts.hasRamp) {
      prependRows = forecastData.alerts.rampBins.map((rampBin) => {
        const startTime = moment.utc(rampBin.startTime).format('HH:mm UTC'),
              endTime = moment.utc(rampBin.endTime).format('HH:mm UTC'),
              severity = rampBin.severity > 1 ? "severe ramp" : "moderate ramp",
              className = rampBin.severity > 1 ? "severe" : "moderate";

        if (farm.displayAlerts !== false) {
          return <tr key={rampBin.startTime.getTime()} className={className}><td>RAMP ALERT</td><td className="right">A {severity} event is forecast starting at {startTime} and ending at {endTime}</td><td><button onClick={()=>this.handleAcknowledgeAlert(rampBin)} type="button">Toggle Alert</button></td></tr>;
        }

        return null;
      });
    }

    if(this.props.selectedTimestamp) {
      const displayTime = moment.utc(this.props.selectedTimestamp).format('HH:mm M/D UTC'),
            forecastAtTime = Forecast.getForecastForTime(this.props.selectedTimestamp),
            forecastMW = commafy(forecastAtTime.bestForecastMW) + " MW",
            prob1stQuantForecastMW = commafy(forecastAtTime.prob1stQuantForecastMW) + " MW",
            prob25thQuantForecastMW = commafy(forecastAtTime.prob25thQuantForecastMW) + " MW",
            prob75thQuantForecastMW = commafy(forecastAtTime.prob75thQuantForecastMW) + " MW",
            prob99thQuantForecastMW = commafy(forecastAtTime.prob99thQuantForecastMW) + " MW",
            actual = (forecastAtTime.actual ? `${forecastAtTime.actual} MW` : "unknown");
      appendRows.push(<tr key={farm.id + "-ts"}><td>Forecast Time</td><td className="right">{displayTime}</td></tr>)
      appendRows.push(<tr key={farm.id + "-fst"}><td>Forecast Power</td><td className="right">{forecastMW}</td></tr>);
      appendRows.push(<tr key={farm.id + "-1"}><td>Forecast Power 1st Percentile</td><td className="right">{prob1stQuantForecastMW}</td></tr>);
      appendRows.push(<tr key={farm.id + "-25"}><td>Forecast Power 25th Percentile</td><td className="right">{prob25thQuantForecastMW}</td></tr>);
      appendRows.push(<tr key={farm.id + "-75"}><td>Forecast Power 75th Percentile</td><td className="right">{prob75thQuantForecastMW}</td></tr>);
      appendRows.push(<tr key={farm.id + "-99"}><td>Forecast Power 99th Percentile</td><td className="right">{prob99thQuantForecastMW}</td></tr>);
      appendRows.push(<tr key={farm.id + "-actl"}><td>Actual Power</td><td className="right">{actual}</td></tr>);
    }
    const el = (
      <div>
        <table className="map-popup">
          <tbody>
          {prependRows}
          <tr>
            <td>Total Farm Capacity</td><td className="right">{commafy(farm.capacity_mw)} MW</td>
          </tr><tr>
            <td>Turbine Manufacturer(s)</td><td className="right">{'manufacturers' in farm ? farm.manufacturers.join(', ') : "unknown"}</td>
          </tr><tr>
            <td>Turbine Models</td><td className="right">{'models' in farm ? farm.models.join(', ') : "unknown" }</td>
          </tr>
          {appendRows}
          </tbody>
        </table>
      </div>
    );
    return el;
  }

  render() {
    if(!this.props.selectedFarmId) {
      return <div id="farmDetail"></div>
    } else {
      return this.getDetailMarkup()
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FarmDetail);
