import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import moment from 'moment';
import commafy from 'commafy';
import './FarmDetail.scss';
import WindFarm from '../../data/windFarm';
import Forecast from '../../data/forecast';


export class FarmDetail extends React.Component {

  componentDidUpdate(prevProps) {
    if ((!prevProps.forecastLoaded) && (this.props.forecastLoaded)) {
      this.setInitialAlertDisplay()
    }
    if(prevProps.settingsTimestamp !== this.props.settingsTimestamp) {
      this.render();
    }
  }

  setInitialAlertDisplay() {
    this.props.onAlertDisplay(WindFarm.getFarms().map(f=>f.id))
  }

  handleAcknowledgeAlert(e) {
    e.preventDefault();
    if (e.target.className === "hideAlert") {
      this.props.onRemoveAlert(this.props.selectedFarmId)
    }
    if (e.target.className === "showAlert") {
      this.props.onAddAlert(this.props.selectedFarmId)
    }
  }

  getDetailMarkup() {
    let prependRows = [],
        alertButton = null,
        appendRows = [],
        farm = WindFarm.getWindFarmById(this.props.selectedFarmId),
        forecastData = Forecast.getForecastForFarm(farm.id);
    if(forecastData.alerts.hasRamp) {
      if (this.props.alertArray.includes(this.props.selectedFarmId)) {
        forecastData.alerts.rampBins.forEach((rampBin) => {
          const startTime = moment.utc(rampBin.startTime).format('HH:mm UTC'),
                endTime = moment.utc(rampBin.endTime).format('HH:mm UTC'),
                severity = rampBin.severity > 2 ? "severe ramp" : rampBin.severity > 1 ? 'moderate ramp' : 'low ramp',
                className = rampBin.severity > 2 ? "severe" : rampBin.severity > 1 ? 'moderate' : 'low';

          prependRows.push(<tr key={rampBin.startTime.getTime()} className={className}><td>RAMP ALERT</td><td className="right">A {severity} event is forecast starting at {startTime} and ending at {endTime}</td></tr>);

      });
    }

      const buttonText = this.props.alertArray.indexOf(this.props.selectedFarmId) !== -1 ? "Hide alerts for selected farm" : "Show alerts for selected farm";
      const buttonClass = this.props.alertArray.indexOf(this.props.selectedFarmId) !== -1 ? "hideAlert" : "showAlert";
      alertButton = <button className={buttonClass} onClick={(e)=>this.handleAcknowledgeAlert(e)} type="button">{buttonText}</button>
    }

    if(this.props.selectedTimestamp) {
      const displayTime = moment.utc(this.props.selectedTimestamp).format('HH:mm M/D UTC'),
            forecastAtTime = Forecast.getForecastForTime(this.props.selectedTimestamp);
      if(forecastAtTime) {
        const forecastMW = forecastAtTime.bestForecastMW ? `${commafy(forecastAtTime.bestForecastMW)} MW` : 'unknown',
              prob1stQuantForecastMW = forecastAtTime.prob1stQuantForecastMW ? `${commafy(forecastAtTime.prob1stQuantForecastMW)} MW` : 'unknown',
              prob25thQuantForecastMW = forecastAtTime.prob25thQuantForecastMW ? `${commafy(forecastAtTime.prob25thQuantForecastMW)} MW` : 'unknown',
              prob75thQuantForecastMW = forecastAtTime.prob75thQuantForecastMW ? `${commafy(forecastAtTime.prob75thQuantForecastMW)} MW` : 'unknown',
              prob99thQuantForecastMW = forecastAtTime.prob99thQuantForecastMW ? `${commafy(forecastAtTime.prob99thQuantForecastMW)} MW` : 'unknown',
              actual = forecastAtTime.actual ? `${commafy(forecastAtTime.actual)} MW` : "unknown";

        appendRows.push(<tr key={farm.id + "-ts"}><td>Forecast Time</td><td className="right">{displayTime}</td></tr>)
        appendRows.push(<tr key={farm.id + "-fst"}><td>Forecast Power</td><td className="right">{forecastMW}</td></tr>);
        appendRows.push(<tr key={farm.id + "-1"}><td>Forecast Power 1st Percentile</td><td className="right">{prob1stQuantForecastMW}</td></tr>);
        appendRows.push(<tr key={farm.id + "-25"}><td>Forecast Power 25th Percentile</td><td className="right">{prob25thQuantForecastMW}</td></tr>);
        appendRows.push(<tr key={farm.id + "-75"}><td>Forecast Power 75th Percentile</td><td className="right">{prob75thQuantForecastMW}</td></tr>);
        appendRows.push(<tr key={farm.id + "-99"}><td>Forecast Power 99th Percentile</td><td className="right">{prob99thQuantForecastMW}</td></tr>);
        appendRows.push(<tr key={farm.id + "-actl"}><td>Actual Power</td><td className="right">{actual}</td></tr>);

      }
    }

    const el = (
      <div>
      {alertButton}
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
