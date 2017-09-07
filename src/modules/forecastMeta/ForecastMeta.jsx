import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps } from './selectors';
import Forecast from '../../data/forecast';
import moment from 'moment';
import './ForecastMeta.scss';


export class ForecastMeta extends React.Component {

  getDetailMarkup() {
    const farm = this.props.selectedFeature,
          forecast = this.props.forecast,
          selectedForecast = Forecast.getForecastForFarm(farm.properties.fid, forecast),
          runtime = moment.utc(selectedForecast.job_completed_at).format('HH:mm M/D UTC'),
          model = selectedForecast.model_name,
          horizon = selectedForecast.forecast_horizon_minutes;

    const el = (
      <div id="forecast-meta">
        <table>
          <tbody>
          <tr>
            <td>Model Name</td><td className="right">{model}</td>
            <td>Forecast Generated</td><td className="right">{runtime}</td>
            <td>Forecast Horizon</td><td className="right">{horizon}</td>
          </tr>
          </tbody>
        </table>
      </div>
    );
    return el;
  }

  getSelectedForecast() {
    const farm = this.props.selectedFeature,
          forecast = this.props.forecast;
    return Forecast.getForecastForFarm(farm.properties.fid, forecast);
  }

  render() {
    const forecast = this.getSelectedForecast();
    if(!forecast) {
      return <div id="forecast-meta"></div>
    } else {
      return this.getDetailMarkup(forecast)
    }
  }
}

export default connect(mapStateToProps, null)(ForecastMeta);
